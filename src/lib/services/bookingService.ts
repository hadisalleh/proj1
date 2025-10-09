import { PrismaClient } from '@prisma/client';
import { BookingCreateRequest } from '@/lib/validations/api';

const prisma = new PrismaClient();

export interface BookingResult {
  id: string;
  tripId: string;
  startDate: Date;
  endDate?: Date;
  guests: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
  trip: {
    id: string;
    title: string;
    locationName: string;
    images: string[];
    boatType: string;
    duration: number;
  };
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export class BookingService {
  static async createBooking(bookingData: BookingCreateRequest): Promise<BookingResult> {
    try {
      // First, check if the trip exists and is available
      const trip = await prisma.trip.findUnique({
        where: { id: bookingData.tripId },
        select: {
          id: true,
          title: true,
          locationName: true,
          images: true,
          boatType: true,
          duration: true,
          basePrice: true,
          maxGuests: true,
        },
      });

      if (!trip) {
        throw new Error('Trip not found');
      }

      if (bookingData.guests > trip.maxGuests) {
        throw new Error(`Maximum ${trip.maxGuests} guests allowed for this trip`);
      }

      // Check for booking conflicts
      const conflictingBookings = await prisma.booking.findMany({
        where: {
          tripId: bookingData.tripId,
          status: {
            in: ['PENDING', 'CONFIRMED'],
          },
          OR: [
            {
              startDate: {
                lte: bookingData.endDate || bookingData.startDate,
              },
              endDate: {
                gte: bookingData.startDate,
              },
            },
            {
              startDate: {
                lte: bookingData.startDate,
              },
              endDate: null,
            },
          ],
        },
      });

      if (conflictingBookings.length > 0) {
        throw new Error('Trip is not available for the selected dates');
      }

      // Create or find user
      let user = await prisma.user.findUnique({
        where: { email: bookingData.customerInfo.email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: bookingData.customerInfo.email,
            name: bookingData.customerInfo.name,
            phone: bookingData.customerInfo.phone,
          },
        });
      } else {
        // Update user info if provided
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: bookingData.customerInfo.name,
            phone: bookingData.customerInfo.phone,
          },
        });
      }

      // Calculate total price
      const totalPrice = Number(trip.basePrice) * bookingData.guests;

      // Create booking
      const booking = await prisma.booking.create({
        data: {
          tripId: bookingData.tripId,
          userId: user.id,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          guests: bookingData.guests,
          totalPrice,
          status: 'PENDING',
        },
        include: {
          trip: {
            select: {
              id: true,
              title: true,
              locationName: true,
              images: true,
              boatType: true,
              duration: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      return {
        id: booking.id,
        tripId: booking.tripId,
        startDate: booking.startDate,
        endDate: booking.endDate || undefined,
        guests: booking.guests,
        totalPrice: Number(booking.totalPrice),
        status: booking.status,
        createdAt: booking.createdAt,
        trip: booking.trip,
        customerInfo: {
          name: booking.user.name || '',
          email: booking.user.email,
          phone: booking.user.phone || '',
        },
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  static async getBookingById(id: string): Promise<BookingResult | null> {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          trip: {
            select: {
              id: true,
              title: true,
              locationName: true,
              images: true,
              boatType: true,
              duration: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      if (!booking) {
        return null;
      }

      return {
        id: booking.id,
        tripId: booking.tripId,
        startDate: booking.startDate,
        endDate: booking.endDate || undefined,
        guests: booking.guests,
        totalPrice: Number(booking.totalPrice),
        status: booking.status,
        createdAt: booking.createdAt,
        trip: booking.trip,
        customerInfo: {
          name: booking.user.name || '',
          email: booking.user.email,
          phone: booking.user.phone || '',
        },
      };
    } catch (error) {
      console.error('Error fetching booking:', error);
      return null;
    }
  }

  static async checkAvailability(
    tripId: string,
    startDate: Date,
    endDate: Date,
    guests: number
  ): Promise<{ available: boolean; reason?: string }> {
    try {
      // Check if trip exists
      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        select: { maxGuests: true },
      });

      if (!trip) {
        return { available: false, reason: 'Trip not found' };
      }

      if (guests > trip.maxGuests) {
        return { available: false, reason: `Maximum ${trip.maxGuests} guests allowed` };
      }

      // Check for booking conflicts
      const conflictingBookings = await prisma.booking.findMany({
        where: {
          tripId,
          status: {
            in: ['PENDING', 'CONFIRMED'],
          },
          OR: [
            {
              startDate: { lte: endDate },
              endDate: { gte: startDate },
            },
            {
              startDate: { lte: startDate },
              endDate: null,
            },
          ],
        },
      });

      if (conflictingBookings.length > 0) {
        return { available: false, reason: 'Trip is not available for the selected dates' };
      }

      return { available: true };
    } catch (error) {
      console.error('Error checking availability:', error);
      return { available: false, reason: 'Failed to check availability' };
    }
  }
}

// Export individual functions for easier importing
export const createBooking = BookingService.createBooking.bind(BookingService);
export const getBookingById = BookingService.getBookingById.bind(BookingService);
export const checkAvailability = BookingService.checkAvailability.bind(BookingService);