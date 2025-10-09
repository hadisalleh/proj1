import { NextRequest, NextResponse } from 'next/server';
import { getBookingById } from '@/lib/services/bookingService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await getBookingById(params.id);
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      booking,
    });
    
  } catch (error) {
    console.error('Error fetching booking:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}