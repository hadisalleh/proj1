import { z } from 'zod';

// Search request validation schema
export const SearchRequestSchema = z.object({
  location: z.string().min(1, "Location is required").max(100, "Location must be less than 100 characters"),
  startDate: z.coerce.date().refine(
    (date) => date >= new Date(new Date().setHours(0, 0, 0, 0)),
    "Start date must be today or in the future"
  ),
  endDate: z.coerce.date().optional(),
  guests: z.coerce.number().min(1, "At least 1 guest is required").max(20, "Maximum 20 guests allowed"),
  filters: z.object({
    priceRange: z.tuple([z.number().min(0), z.number().min(0)]).optional(),
    boatType: z.array(z.string()).optional(),
    fishingType: z.array(z.string()).optional(),
    duration: z.array(z.number().positive()).optional(),
  }).optional(),
}).refine(
  (data) => {
    if (data.endDate && data.startDate) {
      return data.endDate >= data.startDate;
    }
    return true;
  },
  {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  }
);

// Booking creation validation schema
export const BookingCreateSchema = z.object({
  tripId: z.string().cuid("Invalid trip ID format"),
  startDate: z.coerce.date().refine(
    (date) => date >= new Date(new Date().setHours(0, 0, 0, 0)),
    "Start date must be today or in the future"
  ),
  endDate: z.coerce.date().optional(),
  guests: z.coerce.number().min(1, "At least 1 guest is required").max(20, "Maximum 20 guests allowed"),
  customerInfo: z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(10, "Phone number must be at least 10 digits").max(20, "Phone number must be less than 20 digits"),
  }),
}).refine(
  (data) => {
    if (data.endDate && data.startDate) {
      return data.endDate >= data.startDate;
    }
    return true;
  },
  {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  }
);

// Review creation validation schema
export const ReviewCreateSchema = z.object({
  tripId: z.string().cuid("Invalid trip ID format"),
  rating: z.coerce.number().min(1, "Rating must be at least 1 star").max(5, "Rating cannot exceed 5 stars"),
  comment: z.string().max(1000, "Comment must be less than 1000 characters").optional(),
  images: z.array(z.string().url("Invalid image URL")).max(5, "Maximum 5 images allowed").optional(),
  tripDate: z.coerce.date().refine(
    (date) => date <= new Date(),
    "Trip date cannot be in the future"
  ),
});

// Export types for TypeScript usage
export type SearchRequest = z.infer<typeof SearchRequestSchema>;
export type BookingCreateRequest = z.infer<typeof BookingCreateSchema>;
export type ReviewCreateRequest = z.infer<typeof ReviewCreateSchema>;