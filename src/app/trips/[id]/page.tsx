import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import TripDetailClient from '@/components/features/TripDetailClient';
import { getTripById } from '@/lib/services/tripService';

interface TripDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: TripDetailPageProps): Promise<Metadata> {
  try {
    const trip = await getTripById(params.id);
    
    if (!trip) {
      return {
        title: 'Trip Not Found',
      };
    }

    return {
      title: `${trip.title} - Fishing Trip`,
      description: trip.description.substring(0, 160),
      openGraph: {
        title: trip.title,
        description: trip.description.substring(0, 160),
        images: trip.images.slice(0, 1),
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'Trip Not Found',
    };
  }
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  try {
    const trip = await getTripById(params.id);
    
    if (!trip) {
      notFound();
    }

    return <TripDetailClient trip={trip} />;
  } catch (error) {
    console.error('Error loading trip:', error);
    notFound();
  }
}