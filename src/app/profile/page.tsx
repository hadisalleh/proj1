"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { User, Calendar, MapPin, Star, Settings, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import BookingManagementModal from "@/components/features/BookingManagementModal"

interface Booking {
  id: string
  trip: {
    id: string
    title: string
    locationName: string
    images: string[]
    basePrice: number
  }
  startDate: string
  endDate?: string
  guests: number
  totalPrice: number
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  createdAt: string
}

interface Review {
  id: string
  trip: {
    id: string
    title: string
    locationName: string
  }
  rating: number
  comment?: string
  tripDate: string
  createdAt: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [activeTab, setActiveTab] = useState<"bookings" | "reviews">("bookings")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/signin")
      return
    }

    fetchUserData()
  }, [session, status, router])

  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch bookings
      const bookingsResponse = await fetch("/api/user/bookings")
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData.bookings || [])
      }

      // Fetch reviews
      const reviewsResponse = await fetch("/api/user/reviews")
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json()
        setReviews(reviewsData.reviews || [])
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const handleBookingUpdated = (updatedBooking: Booking) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    )
  }

  const handleManageBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowBookingModal(true)
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/user/reviews/${reviewId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setReviews(prev => prev.filter(review => review.id !== reviewId))
        setReviewToDelete(null)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to delete review")
      }
    } catch (error) {
      console.error("Error deleting review:", error)
      alert("Failed to delete review")
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 rounded-full p-3">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {session.user.name || "User"}
              </h1>
              <p className="text-gray-600">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "bookings"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reviews"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Reviews ({reviews.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "bookings" && (
              <div className="space-y-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start exploring and book your first fishing trip!
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/trips"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Browse Trips
                      </Link>
                    </div>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4">
                          <img
                            src={booking.trip.images[0] || "/placeholder-trip.jpg"}
                            alt={booking.trip.title}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              <Link
                                href={`/trips/${booking.trip.id}`}
                                className="hover:text-blue-600"
                              >
                                {booking.trip.title}
                              </Link>
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              {booking.trip.locationName}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(booking.startDate)}
                              {booking.endDate && ` - ${formatDate(booking.endDate)}`}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <User className="h-4 w-4 mr-1" />
                              {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                          <div className="text-lg font-semibold text-gray-900 mt-2">
                            {formatPrice(booking.totalPrice)}
                          </div>
                          <div className="text-sm text-gray-500 mb-3">
                            Booked {formatDate(booking.createdAt)}
                          </div>
                          {["PENDING", "CONFIRMED"].includes(booking.status) && 
                           new Date(booking.startDate) > new Date(Date.now() + 24 * 60 * 60 * 1000) && (
                            <button
                              onClick={() => handleManageBooking(booking)}
                              className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                            >
                              <Settings className="h-4 w-4" />
                              <span>Manage</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Complete a trip and share your experience!
                    </p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            <Link
                              href={`/trips/${review.trip.id}`}
                              className="hover:text-blue-600"
                            >
                              {review.trip.title}
                            </Link>
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {review.trip.locationName}
                          </div>
                          <div className="flex items-center mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                              {review.rating}/5
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-gray-700 mt-3">{review.comment}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 mb-3">
                            <div>Trip: {formatDate(review.tripDate)}</div>
                            <div>Reviewed: {formatDate(review.createdAt)}</div>
                          </div>
                          <div className="flex space-x-2">
                            <Link
                              href={`/trips/${review.trip.id}?editReview=${review.id}`}
                              className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="h-4 w-4" />
                              <span>Edit</span>
                            </Link>
                            <button
                              onClick={() => setReviewToDelete(review.id)}
                              className="inline-flex items-center space-x-1 text-sm text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Management Modal */}
      {selectedBooking && (
        <BookingManagementModal
          booking={selectedBooking}
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false)
            setSelectedBooking(null)
          }}
          onBookingUpdated={handleBookingUpdated}
        />
      )}

      {/* Review Delete Confirmation Modal */}
      {reviewToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Review?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDeleteReview(reviewToDelete)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete Review
              </button>
              <button
                onClick={() => setReviewToDelete(null)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}