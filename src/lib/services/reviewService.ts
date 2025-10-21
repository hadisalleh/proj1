import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export async function calculateTripRatingStats(tripId: string): Promise<ReviewStats> {
  const reviews = await prisma.review.findMany({
    where: { 
      tripId,
      // In a real app, you might filter by approval status:
      // isApproved: true,
    },
    select: { rating: true },
  });

  const totalReviews = reviews.length;
  
  if (totalReviews === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = Math.round((totalRating / totalReviews) * 10) / 10;

  // Calculate rating distribution
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(review => {
    ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
  });

  return {
    totalReviews,
    averageRating,
    ratingDistribution,
  };
}

export async function updateTripAverageRating(tripId: string): Promise<void> {
  try {
    const stats = await calculateTripRatingStats(tripId);
    
    // Note: This assumes you have an averageRating field in your Trip model
    // If you don't have this field, you can calculate it on-the-fly in queries
    // 
    // await prisma.trip.update({
    //   where: { id: tripId },
    //   data: { 
    //     averageRating: stats.averageRating,
    //     totalReviews: stats.totalReviews,
    //   },
    // });
    
    console.log(`Updated trip ${tripId} rating stats:`, stats);
  } catch (error) {
    console.error('Error updating trip rating:', error);
    // Don't throw error as this is optional
  }
}

export async function getReviewsWithStats(
  tripId: string,
  page: number = 1,
  limit: number = 10,
  sortBy: 'newest' | 'oldest' | 'highest' | 'lowest' = 'newest',
  rating?: number
) {
  // Build where clause
  const whereClause: any = { 
    tripId,
    // In a real app, you might filter by approval status:
    // isApproved: true,
  };
  
  if (rating) {
    whereClause.rating = rating;
  }

  // Build orderBy clause
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

  const skip = (page - 1) * limit;

  // Fetch reviews and stats in parallel
  const [reviews, totalCount, stats] = await Promise.all([
    prisma.review.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.review.count({
      where: whereClause,
    }),
    calculateTripRatingStats(tripId),
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    reviews: reviews.map(review => ({
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
    })),
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
      hasNextPage,
      hasPrevPage,
    },
    stats,
  };
}

export async function deleteReview(reviewId: string, userId: string): Promise<boolean> {
  try {
    // Verify the review belongs to the user
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true, tripId: true },
    });

    if (!review || review.userId !== userId) {
      return false;
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Update trip rating stats
    await updateTripAverageRating(review.tripId);

    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    return false;
  }
}

export async function reportReview(
  reviewId: string, 
  reporterId: string, 
  reason: string
): Promise<boolean> {
  try {
    // In a real app, you would store reports in a separate table
    // For now, just log the report
    console.log(`Review ${reviewId} reported by ${reporterId} for: ${reason}`);
    
    // You could implement a reports table like:
    // await prisma.reviewReport.create({
    //   data: {
    //     reviewId,
    //     reporterId,
    //     reason,
    //   },
    // });

    return true;
  } catch (error) {
    console.error('Error reporting review:', error);
    return false;
  }
}