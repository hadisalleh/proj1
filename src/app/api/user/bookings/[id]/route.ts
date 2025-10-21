import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db as prisma } from "@/lib/db"
import { z } from "zod"

const UpdateBookingSchema = z.object({
  guests: z.number().min(1).max(20).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const bookingId = params.id
    const body = await request.json()
    const validatedData = UpdateBookingSchema.parse(body)

    // Check if booking exists and belongs to user
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: user.id,
      },
    })

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Only allow modifications for PENDING or CONFIRMED bookings
    if (!["PENDING", "CONFIRMED"].includes(existingBooking.status)) {
      return NextResponse.json(
        { error: "Cannot modify this booking" },
        { status: 400 }
      )
    }

    // Check if the booking is not in the past
    const bookingDate = new Date(existingBooking.startDate)
    const now = new Date()
    if (bookingDate < now) {
      return NextResponse.json(
        { error: "Cannot modify past bookings" },
        { status: 400 }
      )
    }

    const updateData: {
      guests?: number;
      startDate?: Date;
      endDate?: Date;
      totalPrice?: number;
    } = {}
    
    if (validatedData.guests) {
      updateData.guests = validatedData.guests
    }
    
    if (validatedData.startDate) {
      const newStartDate = new Date(validatedData.startDate)
      if (newStartDate < now) {
        return NextResponse.json(
          { error: "Start date cannot be in the past" },
          { status: 400 }
        )
      }
      updateData.startDate = newStartDate
    }
    
    if (validatedData.endDate) {
      updateData.endDate = new Date(validatedData.endDate)
    }

    // Recalculate total price if guests changed
    if (validatedData.guests) {
      const trip = await prisma.trip.findUnique({
        where: { id: existingBooking.tripId },
      })
      
      if (trip) {
        updateData.totalPrice = Number(trip.basePrice) * validatedData.guests
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        trip: {
          select: {
            id: true,
            title: true,
            locationName: true,
            images: true,
          },
        },
      },
    })

    return NextResponse.json({ booking: updatedBooking })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating booking:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const bookingId = params.id

    // Check if booking exists and belongs to user
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: user.id,
      },
    })

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Only allow cancellation for PENDING or CONFIRMED bookings
    if (!["PENDING", "CONFIRMED"].includes(existingBooking.status)) {
      return NextResponse.json(
        { error: "Cannot cancel this booking" },
        { status: 400 }
      )
    }

    // Check if the booking is not in the past (allow cancellation up to 24 hours before)
    const bookingDate = new Date(existingBooking.startDate)
    const now = new Date()
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    if (bookingDate < twentyFourHoursFromNow) {
      return NextResponse.json(
        { error: "Cannot cancel bookings less than 24 hours before start time" },
        { status: 400 }
      )
    }

    // Update booking status to CANCELLED instead of deleting
    const cancelledBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
      include: {
        trip: {
          select: {
            id: true,
            title: true,
            locationName: true,
            images: true,
          },
        },
      },
    })

    return NextResponse.json({ 
      message: "Booking cancelled successfully",
      booking: cancelledBooking 
    })
  } catch (error) {
    console.error("Error cancelling booking:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}