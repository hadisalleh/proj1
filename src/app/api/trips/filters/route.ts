import { NextResponse } from 'next/server';
import { TripService } from '@/lib/services/tripService';

// GET /api/trips/filters
export async function GET() {
  try {
    const filterOptions = await TripService.getFilterOptions();

    return NextResponse.json({
      success: true,
      data: filterOptions
    });

  } catch (error) {
    console.error('Filter options API Error:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}