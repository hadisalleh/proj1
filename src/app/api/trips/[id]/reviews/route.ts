import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { 
  moderateReviewContent, 
  shouldAutoReject, 
  shouldRequireManualReview,
  checkRateLimit 
} from '@/lib/utils/reviewModeration';
import { getReviewsWithStats, updateTripAverageRating } from '@/lib/services/reviewService';

const prisma = new PrismaClient();

const ReviewsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  sortBy: z.enum(['newest', 'oldest', 'highest', 'lowest']).default('newest'),
  rating: z.coerce.number().min(1).max(5).optional(),
});

const ReviewCreateSchema = z.object({
  rating: z.coerce.number().min(1, "Rating must be at least 1 star").max(5, "Rating cannot exceed 5 stars"),
  comment: z.string().min(1, "Comment is required").max(1000, "Comment must be less than 1000 characters"),
  tripDate: z.string().min(1, "Trip date is required").refine(
    (date) => {
      const tripDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return tripDate <= today && !isNaN(tripDate.getTime());
    },
    {
      message: "Trip date must be a valid date in the past or today",
    }
  ),
  userId: z.string().cuid("Invalid user ID"),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const query = ReviewsQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      sortBy: searchParams.get('sortBy'),
      rating: searchParams.get('rating'),
    });

    const { page, limit, sortBy, rating } = query;
    const skip = (page - 1) * limit;

    // Build orderBy clause based on sortBy
    let orderBy: any = { createdAt: 'desc' };
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'highest':
        orderBy = { rating: 'desc' };
        break;
      case 'lowest':
        orderBy = { rating: 'asc' };
        break;
    }

    // Use the review service to get reviews with stats
    const result = await getReviewsWithStats(
      params.id,
      page,
      limit,
      sortBy,
      rating
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tripId = params.id;

    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Check rate limiting (3 reviews per hour per IP)
    const rateLimitResult = checkRateLimit(`review_${clientIP}`, 3, 60);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many review submissions. Please try again later.',
          resetTime: rateLimitResult.resetTime 
        },
        { status: 429 }
      );
    }

    // Verify trip exists
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    
    // Extract and validate basic fields
    const reviewData = {
      rating: formData.get('rating') as string,
      comment: formData.get('comment') as string,
      tripDate: formData.get('tripDate') as string,
      userId: 'user_temp_id', // TODO: Replace with actual user ID from session
    };

    // Validate the review data
    const validatedData = ReviewCreateSchema.parse(reviewData);

    // Moderate review content
    const moderationResult = moderateReviewContent(validatedData.comment);
    
    // Auto-reject inappropriate content
    if (shouldAutoReject(moderationResult)) {
      return NextResponse.json(
        { 
          error: 'Review content violates our community guidelines',
          details: moderationResult.reasons 
        },
        { status: 400 }
      );
    }

    // Handle image uploads
    const imageUrls: string[] = [];
    const images = formData.getAll('images') as File[];
    
    if (images.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 images allowed' },
        { status: 400 }
      );
    }

    // Process image uploads
    for (const image of images) {
      if (image.size === 0) continue; // Skip empty files
      
      // Validate file type and size
      if (!image.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        );
      }

      if (image.size > 5 * 1024 * 1024) { // 5MB limit
        return NextResponse.json(
          { error: 'Image size must be less than 5MB' },
          { status: 400 }
        );
      }

      // Generate unique filename
      const fileExtension = image.name.split('.').pop() || 'jpg';
      const fileName = `${uuidv4()}.${fileExtension}`;
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'reviews');
      const filePath = join(uploadDir, fileName);

      // Ensure upload directory exists
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        // Directory might already exist, ignore error
      }

      // Save file
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Store the public URL
      imageUrls.push(`/uploads/reviews/${fileName}`);
    }

    // Check for duplicate review (same user and trip)
    const existingReview = await prisma.review.findUnique({
      where: {
        tripId_userId: {
          tripId: tripId,
          userId: validatedData.userId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this trip' },
        { status: 409 }
      );
    }

    // Determine if review needs manual approval
    const needsManualReview = shouldRequireManualReview(moderationResult);

    // Create the review
    const review = await prisma.review.create({
      data: {
        tripId: tripId,
        userId: validatedData.userId,
        rating: validatedData.rating,
        comment: validatedData.comment,
        tripDate: new Date(validatedData.tripDate),
        images: imageUrls,
        // Note: In a real app, you might add fields like:
        // isApproved: !needsManualReview,
        // moderationScore: moderationResult.confidence,
        // moderationReasons: moderationResult.reasons,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Update trip's average rating (optional optimization)
    await updateTripAverageRating(tripId);

    return NextResponse.json({
      message: needsManualReview 
        ? 'Review submitted and is pending approval' 
        : 'Review created successfully',
      review: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        images: review.images,
        tripDate: review.tripDate,
        createdAt: review.createdAt,
        user: {
          name: review.user.name,
          email: review.user.email,
        },
      },
      needsApproval: needsManualReview,
      moderationInfo: {
        confidence: moderationResult.confidence,
        reasons: moderationResult.reasons,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating review:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid review data', 
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

