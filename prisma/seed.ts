import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create sample trips
  const trip1 = await prisma.trip.create({
    data: {
      title: 'Deep Sea Fishing Adventure',
      description: 'Experience the thrill of deep sea fishing in crystal clear waters. Perfect for beginners and experienced anglers alike.',
      locationName: 'Marina Bay',
      latitude: 25.7617,
      longitude: -80.1918,
      duration: 8,
      basePrice: 299.99,
      images: [
        '/images/deep-sea-1.jpg',
        '/images/deep-sea-2.jpg'
      ],
      inclusions: [
        'Professional guide',
        'Fishing equipment',
        'Bait and tackle',
        'Light refreshments',
        'Safety equipment'
      ],
      boatType: 'Sport Fishing Boat',
      fishingTypes: ['Deep Sea', 'Trolling', 'Bottom Fishing'],
      maxGuests: 6
    }
  })

  const trip2 = await prisma.trip.create({
    data: {
      title: 'Sunset Fishing Charter',
      description: 'Enjoy a peaceful evening fishing trip as the sun sets over the horizon. Perfect for couples and families.',
      locationName: 'Sunset Harbor',
      latitude: 25.7753,
      longitude: -80.1937,
      duration: 4,
      basePrice: 189.99,
      images: [
        '/images/sunset-1.jpg',
        '/images/sunset-2.jpg'
      ],
      inclusions: [
        'Experienced captain',
        'Fishing gear',
        'Sunset viewing',
        'Complimentary drinks',
        'Photo opportunities'
      ],
      boatType: 'Pontoon Boat',
      fishingTypes: ['Inshore', 'Light Tackle'],
      maxGuests: 8
    }
  })

  const trip3 = await prisma.trip.create({
    data: {
      title: 'Half Day Reef Fishing',
      description: 'Target reef fish in shallow waters. Great for families with children and those new to saltwater fishing.',
      locationName: 'Coral Reef Marina',
      latitude: 25.7589,
      longitude: -80.1901,
      duration: 4,
      basePrice: 149.99,
      images: [
        '/images/reef-1.jpg',
        '/images/reef-2.jpg'
      ],
      inclusions: [
        'Licensed guide',
        'All fishing equipment',
        'Bait included',
        'Fish cleaning service',
        'Cooler with ice'
      ],
      boatType: 'Center Console',
      fishingTypes: ['Reef Fishing', 'Bottom Fishing'],
      maxGuests: 4
    }
  })

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      phone: '+1-555-0123'
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      phone: '+1-555-0456'
    }
  })

  // Create test user for login
  const hashedPassword = await hash('P@ssword1234', 12)
  const testUser = await prisma.user.create({
    data: {
      email: 'test@cubaje.my',
      name: 'Test User',
      phone: '+60-123-456789',
      password: hashedPassword
    }
  })

  // Create sample bookings
  await prisma.booking.create({
    data: {
      tripId: trip1.id,
      userId: user1.id,
      startDate: new Date('2024-11-15T08:00:00Z'),
      endDate: new Date('2024-11-15T16:00:00Z'),
      guests: 4,
      totalPrice: 1199.96,
      status: 'CONFIRMED'
    }
  })

  await prisma.booking.create({
    data: {
      tripId: trip2.id,
      userId: user2.id,
      startDate: new Date('2024-11-20T16:00:00Z'),
      endDate: new Date('2024-11-20T20:00:00Z'),
      guests: 2,
      totalPrice: 379.98,
      status: 'PENDING'
    }
  })

  // Create booking for test user
  await prisma.booking.create({
    data: {
      tripId: trip1.id,
      userId: testUser.id,
      startDate: new Date('2024-12-01T08:00:00Z'),
      endDate: new Date('2024-12-01T16:00:00Z'),
      guests: 3,
      totalPrice: 899.97,
      status: 'CONFIRMED'
    }
  })

  // Create sample reviews
  await prisma.review.create({
    data: {
      tripId: trip3.id,
      userId: user1.id,
      rating: 5,
      comment: 'Amazing experience! The guide was knowledgeable and we caught plenty of fish. Highly recommend!',
      images: ['/images/review-1.jpg'],
      tripDate: new Date('2024-10-01T10:00:00Z')
    }
  })

  await prisma.review.create({
    data: {
      tripId: trip1.id,
      userId: user2.id,
      rating: 4,
      comment: 'Great deep sea fishing trip. The boat was comfortable and the crew was professional.',
      images: [],
      tripDate: new Date('2024-09-15T08:00:00Z')
    }
  })

  // Create review for test user
  await prisma.review.create({
    data: {
      tripId: trip2.id,
      userId: testUser.id,
      rating: 5,
      comment: 'Perfect sunset fishing experience! The captain was friendly and we caught some beautiful fish. Will definitely book again!',
      images: ['/images/test-review-1.jpg'],
      tripDate: new Date('2024-10-15T16:00:00Z')
    }
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })