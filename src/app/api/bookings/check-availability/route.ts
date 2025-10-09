import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkAvailability } from '@/lib/services/bookingService';

const AvailabilityCheckSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  startDate: z.coerce.date().refine(
    (date) => date >= new Date(new Date().setHours(0, 0, 0, 0)),
    "Start date must be today or in the future"
  ),
  endDate: z.coerce.date().optional(),
  guests: z.coerce.number().min(1, "At least 1 guest is required").max(20, "Maximum 20 guests allowed"),
}).refine(
  (data) => {
    if (data.endDate && data.startDate) {
      return data.endDate >= data.startDate;
    }
    return true;
  },
  {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validatedData = AvailabilityCheckSchema.parse(body);
    
    // Check availability
    const result = await checkAvailability(
      validatedData.tripId,
      validatedData.startDate,
      validatedData.endDate || validatedData.startDate,
      validatedData.guests
    );
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error checking availability:', error);
    
    // Handle validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
      return NextResponse.json(
        { 
          error: 'Invalid request data', 
          details: (error as any).issues 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}