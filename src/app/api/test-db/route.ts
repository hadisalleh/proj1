import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    const user = await prisma.user.findUnique({
      where: { email: 'test@cubaje.my' }
    })
    
    console.log('Database test result:', !!user)
    
    return NextResponse.json({ 
      success: true, 
      userExists: !!user,
      userEmail: user?.email 
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}