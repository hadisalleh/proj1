import { NextRequest, NextResponse } from 'next/server';
import { TripService } from '@/lib/services/tripService';

// GET /api/trips/featured
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');

    const featuredTrips = await TripService.getFeaturedTrips(limit);

    return NextResponse.json({
      success: true,
      data: {
        trips: featuredTrips
      }
    });

  } catch (error) {
    console.error('Featured trips API Error:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}