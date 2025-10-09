import { z } from 'zod';

// Booking status enum schema
export const BookingStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']);

// Trip model validation schema
export const TripSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required"),
  locationName: z.string().min(1, "Location name is required").max(100, "Location name must be less than 100 characters"),
  latitude: z.number().min(-90, "Invalid latitude").max(90, "Invalid latitude"),
  longitude: z.number().min(-180, "Invalid longitude").max(180, "Invalid longitude"),
  duration: z.number().positive("Duration must be positive"),
  basePrice: z.number().positive("Base price must be positive"),
  images: z.array(z.string().url("Invalid image URL")).min(1, "At least one image is required"),
  inclusions: z.array(z.string().min(1, "Inclusion cannot be empty")),
  boatType: z.string().min(1, "Boat type is required"),
  fishingTypes: z.array(z.string().min(1, "Fishing type cannot be empty")).min(1, "At least one fishing type is required"),
  maxGuests: z.number().positive("Max guests must be positive").max(50, "Maximum 50 guests allowed"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// User model validation schema
export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").nullable(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20, "Phone number must be less than 20 digits").nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Booking model validation schema
export const BookingSchema = z.object({
  id: z.string().cuid(),
  tripId: z.string().cuid(),
  userId: z.string().cuid(),
  startDate: z.date(),
  endDate: z.date().nullable(),
  guests: z.number().min(1, "At least 1 guest is required").max(20, "Maximum 20 guests allowed"),
  totalPrice: z.number().positive("Total price must be positive"),
  status: BookingStatusSchema,
  paymentId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Review model validation schema
export const ReviewSchema = z.object({
  id: z.string().cuid(),
  tripId: z.string().cuid(),
  userId: z.string().cuid(),
  rating: z.number().min(1, "Rating must be at least 1 star").max(5, "Rating cannot exceed 5 stars"),
  comment: z.string().max(1000, "Comment must be less than 1000 characters").nullable(),
  images: z.array(z.string().url("Invalid image URL")).max(5, "Maximum 5 images allowed"),
  tripDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Export types for TypeScript usage
export type Trip = z.infer<typeof TripSchema>;
export type User = z.infer<typeof UserSchema>;
export type Booking = z.infer<typeof BookingSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type BookingStatus = z.infer<typeof BookingStatusSchema>;