import { NextRequest, NextResponse } from 'next/server';
import { SearchRequestSchema } from '@/lib/validations/api';
import { TripService } from '@/lib/services/tripService';
import { z } from 'zod';

// GET /api/trips/search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const queryData = {
      location: searchParams.get('location') || '',
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      guests: searchParams.get('guests'),
      filters: {
        priceRange: searchParams.get('priceRange') ? JSON.parse(searchParams.get('priceRange')!) : undefined,
        boatType: searchParams.get('boatType') ? JSON.parse(searchParams.get('boatType')!) : undefined,
        fishingType: searchParams.get('fishingType') ? JSON.parse(searchParams.get('fishingType')!) : undefined,
        duration: searchParams.get('duration') ? JSON.parse(searchParams.get('duration')!) : undefined,
      }
    };

    // Validate request data
    const validatedData = SearchRequestSchema.parse(queryData);

    // Parse pagination and sorting parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sortBy = searchParams.get('sortBy') as any || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') as any || 'desc';

    // Execute search using service
    const searchResult = await TripService.searchTrips(validatedData, {
      page,
      limit,
      sortBy,
      sortOrder
    });

    return NextResponse.json({
      success: true,
      data: {
        ...searchResult,
        filters: {
          location: validatedData.location,
          startDate: validatedData.startDate,
          endDate: validatedData.endDate,
          guests: validatedData.guests,
          appliedFilters: validatedData.filters
        }
      }
    });

  } catch (error) {
    console.error('Search API Error:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request parameters',
        details: error.issues
      }, { status: 400 });
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON in request parameters'
      }, { status: 400 });
    }

    // Handle database errors
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}