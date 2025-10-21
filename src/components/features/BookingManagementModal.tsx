"use client"

import { useState } from "react"
import { X, Calendar, Users, AlertTriangle, Edit, Trash2 } from "lucide-react"

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

interface BookingManagementModalProps {
  booking: Booking
  isOpen: boolean
  onClose: () => void
  onBookingUpdated: (updatedBooking: Booking) => void
}

export default function BookingManagementModal({
  booking,
  isOpen,
  onClose,
  onBookingUpdated,
}: BookingManagementModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [editForm, setEditForm] = useState({
    guests: booking.guests,
    startDate: booking.startDate.split('T')[0], // Format for date input
  })

  if (!isOpen) return null

  const canModify = ["PENDING", "CONFIRMED"].includes(booking.status) && 
    new Date(booking.startDate) > new Date(Date.now() + 24 * 60 * 60 * 1000)

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

  const handleUpdateBooking = async () => {
    if (!canModify) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/user/bookings/${booking.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guests: editForm.guests,
          startDate: new Date(editForm.startDate).toISOString(),
        }),
      })

      if (response.ok) {
        const { booking: updatedBooking } = await response.json()
        onBookingUpdated(updatedBooking)
        setIsEditing(false)
        onClose()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to update booking")
      }
    } catch (error) {
      console.error("Error updating booking:", error)
      alert("Failed to update booking")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async () => {
    if (!canModify) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/user/bookings/${booking.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        const { booking: cancelledBooking } = await response.json()
        onBookingUpdated(cancelledBooking)
        setShowCancelConfirm(false)
        onClose()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to cancel booking")
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
      alert("Failed to cancel booking")
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Manage Booking
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Trip Info */}
          <div className="flex space-x-4 mb-6">
            <img
              src={booking.trip.images[0] || "/placeholder-trip.jpg"}
              alt={booking.trip.title}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {booking.trip.title}
              </h3>
              <p className="text-gray-600">{booking.trip.locationName}</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status}
              </span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">Date:</span>
              </div>
              {isEditing ? (
                <input
                  type="date"
                  value={editForm.startDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, startDate: e.target.value })
                  }
                  min={new Date().toISOString().split('T')[0]}
                  className="border border-gray-300 rounded-md px-3 py-1"
                />
              ) : (
                <span className="font-medium">
                  {formatDate(booking.startDate)}
                  {booking.endDate && ` - ${formatDate(booking.endDate)}`}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">Guests:</span>
              </div>
              {isEditing ? (
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={editForm.guests}
                  onChange={(e) =>
                    setEditForm({ ...editForm, guests: parseInt(e.target.value) })
                  }
                  className="border border-gray-300 rounded-md px-3 py-1 w-20"
                />
              ) : (
                <span className="font-medium">
                  {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total Price:</span>
              <span className="font-semibold text-lg">
                {isEditing
                  ? formatPrice(booking.trip.basePrice * editForm.guests)
                  : formatPrice(booking.totalPrice)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Booked:</span>
              <span className="text-gray-600">
                {formatDate(booking.createdAt)}
              </span>
            </div>
          </div>

          {/* Warning for non-modifiable bookings */}
          {!canModify && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    {booking.status === "COMPLETED" || booking.status === "CANCELLED"
                      ? "This booking cannot be modified."
                      : "Bookings can only be modified or cancelled up to 24 hours before the start time."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {canModify && (
              <>
                {isEditing ? (
                  <>
                    <button
                      onClick={handleUpdateBooking}
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Updating..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setEditForm({
                          guests: booking.guests,
                          startDate: booking.startDate.split('T')[0],
                        })
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Modify Booking</span>
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cancel Booking?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelBooking}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {isLoading ? "Cancelling..." : "Yes, Cancel Booking"}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
                >
                  Keep Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}