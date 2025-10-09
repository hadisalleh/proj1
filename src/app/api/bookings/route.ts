import { NextRequest, NextResponse } from 'next/server';
import { BookingCreateSchema } from '@/lib/validations/api';
import { createBooking } from '@/lib/services/bookingService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validatedData = BookingCreateSchema.parse(body);
    
    // Create booking
    const booking = await createBooking(validatedData);
    
    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      booking: {
        id: booking.id,
        status: booking.status,
        totalPrice: booking.totalPrice,
        trip: {
          title: booking.trip.title,
          locationName: booking.trip.locationName,
        },
      },
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating booking:', error);
    
    if (error instanceof Error) {
      // Handle specific business logic errors
      if (error.message.includes('not found') || 
          error.message.includes('not available') || 
          error.message.includes('Maximum')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }
    
    // Handle validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
      return NextResponse.json(
        { 
          error: 'Invalid booking data', 
          details: (error as any).issues 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}