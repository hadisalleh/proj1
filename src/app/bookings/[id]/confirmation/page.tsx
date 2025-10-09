import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import BookingConfirmation from '@/components/features/BookingConfirmation';
import { getBookingById } from '@/lib/services/bookingService';

interface BookingConfirmationPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: BookingConfirmationPageProps): Promise<Metadata> {
  return {
    title: 'Booking Confirmation - Fishing Trip',
    description: 'Your fishing trip booking has been confirmed.',
  };
}

export default async function BookingConfirmationPage({ params }: BookingConfirmationPageProps) {
  try {
    const booking = await getBookingById(params.id);
    
    if (!booking) {
      notFound();
    }

    return <BookingConfirmation booking={booking} />;
  } catch (error) {
    console.error('Error loading booking:', error);
    notFound();
  }
}