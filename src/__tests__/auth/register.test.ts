import { NextRequest } from 'next/server'
import { hash } from 'bcryptjs'

// Mock Prisma
jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

import { POST } from '@/app/api/auth/register/route'

const mockPrismaUser = require('@/lib/db').db.user

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}))

const mockHash = hash as jest.MockedFunction<typeof hash>

describe('/api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST', () => {
    it('should successfully register a new user', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      }

      const hashedPassword = 'hashed_password_123'
      const createdUser = {
        id: 'user_123',
        name: userData.name,
        email: userData.email,
        createdAt: new Date(),
      }

      mockPrismaUser.findUnique.mockResolvedValue(null)
      mockHash.mockResolvedValue(hashedPassword)
      mockPrismaUser.create.mockResolvedValue({
        ...createdUser,
        password: hashedPassword,
        phone: null,
        updatedAt: new Date(),
      })

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(201)
      expect(responseData.message).toBe('User created successfully')
      expect(responseData.user).toEqual(createdUser)
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      })
      expect(mockHash).toHaveBeenCalledWith(userData.password, 12)
      expect(mockPrismaUser.create).toHaveBeenCalledWith({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      })
    })

    it('should return error if user already exists', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      }

      const existingUser = {
        id: 'existing_user_123',
        name: 'Existing User',
        email: userData.email,
        password: 'existing_password',
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrismaUser.findUnique.mockResolvedValue(existingUser)

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(responseData.message).toBe('User with this email already exists')
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      })
      expect(mockHash).not.toHaveBeenCalled()
      expect(mockPrismaUser.create).not.toHaveBeenCalled()
    })

    it('should return validation error for invalid input', async () => {
      // Arrange
      const invalidUserData = {
        name: 'J', // Too short
        email: 'invalid-email', // Invalid email format
        password: '123', // Too short
      }

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(invalidUserData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(responseData.message).toBe('Invalid input data')
      expect(responseData.errors).toBeDefined()
      expect(responseData.errors).toHaveLength(3)
      expect(mockPrismaUser.findUnique).not.toHaveBeenCalled()
    })

    it('should return validation error for missing fields', async () => {
      // Arrange
      const incompleteUserData = {
        name: 'John Doe',
        // Missing email and password
      }

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(incompleteUserData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(responseData.message).toBe('Invalid input data')
      expect(responseData.errors).toBeDefined()
      expect(mockPrismaUser.findUnique).not.toHaveBeenCalled()
    })

    it('should handle database errors gracefully', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      }

      mockPrismaUser.findUnique.mockRejectedValue(new Error('Database connection failed'))

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(responseData.message).toBe('Internal server error')
    })
  })
})