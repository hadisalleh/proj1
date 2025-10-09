// Core data types for the fishing trip application

export interface Trip {
  id: string;
  title: string;
  description: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  duration: number; // in hours
  basePrice: number;
  images: string[];
  rating: number;
  reviewCount: number;
  inclusions: string[];
  boatType: string;
  fishingTypes: string[];
  maxGuests: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  priceRange?: [number, number];
  boatType?: string[];
  fishingType?: string[];
  duration?: number[];
}

export interface SearchRequest {
  location: string;
  startDate: Date;
  endDate?: Date;
  guests: number;
  filters?: SearchFilters;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  tripId: string;
  userId: string;
  startDate: Date;
  endDate?: Date;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  tripId: string;
  userId: string;
  rating: number;
  comment?: string;
  images?: string[];
  tripDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}
