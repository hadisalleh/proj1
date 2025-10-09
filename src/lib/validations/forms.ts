import { z } from 'zod';

// Search form validation schema
export const SearchFormSchema = z.object({
  location: z.string().min(1, "Please enter a location"),
  startDate: z.string().min(1, "Please select a start date"),
  endDate: z.string().optional(),
  guests: z.coerce.number().min(1, "At least 1 guest is required").max(20, "Maximum 20 guests allowed"),
});

// Booking form validation schema
export const BookingFormSchema = z.object({
  startDate: z.string().min(1, "Please select a start date"),
  endDate: z.string().optional(),
  guests: z.coerce.number().min(1, "At least 1 guest is required").max(20, "Maximum 20 guests allowed"),
  customerName: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  customerEmail: z.string().email("Please enter a valid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits").max(20, "Phone number must be less than 20 digits"),
  specialRequests: z.string().max(500, "Special requests must be less than 500 characters").optional(),
});

// Review form validation schema
export const ReviewFormSchema = z.object({
  rating: z.coerce.number().min(1, "Please select a rating").max(5, "Rating cannot exceed 5 stars"),
  comment: z.string().max(1000, "Review must be less than 1000 characters").optional(),
  images: z.array(z.instanceof(File)).max(5, "Maximum 5 images allowed").optional(),
});

// Filter form validation schema
export const FilterFormSchema = z.object({
  priceMin: z.coerce.number().min(0, "Minimum price cannot be negative").optional(),
  priceMax: z.coerce.number().min(0, "Maximum price cannot be negative").optional(),
  boatTypes: z.array(z.string()).optional(),
  fishingTypes: z.array(z.string()).optional(),
  minDuration: z.coerce.number().positive("Duration must be positive").optional(),
  maxDuration: z.coerce.number().positive("Duration must be positive").optional(),
  maxGuests: z.coerce.number().positive("Max guests must be positive").optional(),
}).refine(
  (data) => {
    if (data.priceMin !== undefined && data.priceMax !== undefined) {
      return data.priceMax >= data.priceMin;
    }
    return true;
  },
  {
    message: "Maximum price must be greater than or equal to minimum price",
    path: ["priceMax"],
  }
).refine(
  (data) => {
    if (data.minDuration !== undefined && data.maxDuration !== undefined) {
      return data.maxDuration >= data.minDuration;
    }
    return true;
  },
  {
    message: "Maximum duration must be greater than or equal to minimum duration",
    path: ["maxDuration"],
  }
);

// Contact form validation schema
export const ContactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  message: z.string().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

// Newsletter signup validation schema
export const NewsletterSignupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Export types for TypeScript usage
export type SearchFormData = z.infer<typeof SearchFormSchema>;
export type BookingFormData = z.infer<typeof BookingFormSchema>;
export type ReviewFormData = z.infer<typeof ReviewFormSchema>;
export type FilterFormData = z.infer<typeof FilterFormSchema>;
export type ContactFormData = z.infer<typeof ContactFormSchema>;
export type NewsletterSignupData = z.infer<typeof NewsletterSignupSchema>;