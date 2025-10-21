import { NextRequest, NextResponse } from 'next/server'
import { hash, compare } from 'bcryptjs'

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

import { POST as registerPOST } from '@/app/api/auth/register/route'
import { authOptions } from '@/lib/auth'

const mockPrismaUser = require('@/lib/db').db.user

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

const mockHash = hash as jest.MockedFunction<typeof hash>
const mockCompare = compare as jest.MockedFunction<typeof compare>

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Complete Registration and Login Flow', () => {
    it('should complete full registration and login cycle', async () => {
      // Step 1: Register a new user
      const userData = {
        name: 'Integration Test User',
        email: 'integration@example.com',
        password: 'password123',
      }

      const hashedPassword = 'hashed_password_123'
      const createdUser = {
        id: 'user_integration_123',
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Mock registration
      mockPrismaUser.findUnique.mockResolvedValueOnce(null) // User doesn't exist
      mockHash.mockResolvedValue(hashedPassword)
      mockPrismaUser.create.mockResolvedValue(createdUser)

      const registerRequest = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' },
      })

      const registerResponse = await registerPOST(registerRequest)
      const registerData = await registerResponse.json()

      expect(registerResponse.status).toBe(201)
      expect(registerData.message).toBe('User created successfully')
      expect(registerData.user.email).toBe(userData.email)

      // Step 2: Login with the registered user
      const credentialsProvider = authOptions.providers?.find(
        (provider) => provider.id === 'credentials'
      ) as any

      // Mock login
      mockPrismaUser.findUnique.mockResolvedValueOnce(createdUser) // User exists
      mockCompare.mockResolvedValue(true) // Password matches

      const loginResult = await credentialsProvider.authorize({
        email: userData.email,
        password: userData.password,
      })

      expect(loginResult).toEqual({
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
      })

      // Step 3: Test JWT callback
      const jwtResult = await authOptions.callbacks?.jwt?.({
        token: { email: userData.email },
        user: loginResult,
      } as any)

      expect(jwtResult).toEqual({
        email: userData.email,
        id: createdUser.id,
      })

      // Step 4: Test session callback
      const sessionResult = await authOptions.callbacks?.session?.({
        session: {
          user: { email: userData.email, name: userData.name },
          expires: '2024-12-31T23:59:59.999Z',
        },
        token: jwtResult,
      } as any)

      expect(sessionResult.user.id).toBe(createdUser.id)
      expect(sessionResult.user.email).toBe(userData.email)
      expect(sessionResult.user.name).toBe(userData.name)
    })

    it('should prevent duplicate registration and allow existing user login', async () => {
      const userData = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123',
      }

      const existingUser = {
        id: 'existing_user_123',
        name: userData.name,
        email: userData.email,
        password: 'existing_hashed_password',
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Step 1: Try to register existing user
      mockPrismaUser.findUnique.mockResolvedValueOnce(existingUser)

      const registerRequest = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' },
      })

      const registerResponse = await registerPOST(registerRequest)
      const registerData = await registerResponse.json()

      expect(registerResponse.status).toBe(400)
      expect(registerData.message).toBe('User with this email already exists')

      // Step 2: Login with existing user should work
      const credentialsProvider = authOptions.providers?.find(
        (provider) => provider.id === 'credentials'
      ) as any

      mockPrismaUser.findUnique.mockResolvedValueOnce(existingUser)
      mockCompare.mockResolvedValue(true)

      const loginResult = await credentialsProvider.authorize({
        email: userData.email,
        password: userData.password,
      })

      expect(loginResult).toEqual({
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      })
    })
  })

  describe('Security Validation Integration', () => {
    it('should reject weak passwords during registration', async () => {
      const weakPasswordData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123', // Too weak
      }

      const registerRequest = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(weakPasswordData),
        headers: { 'Content-Type': 'application/json' },
      })

      const registerResponse = await registerPOST(registerRequest)
      const registerData = await registerResponse.json()

      expect(registerResponse.status).toBe(400)
      expect(registerData.message).toBe('Invalid input data')
      expect(registerData.errors).toBeDefined()
      expect(mockPrismaUser.findUnique).not.toHaveBeenCalled()
    })

    it('should reject invalid email formats', async () => {
      const invalidEmailData = {
        name: 'Test User',
        email: 'invalid-email-format',
        password: 'password123',
      }

      const registerRequest = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(invalidEmailData),
        headers: { 'Content-Type': 'application/json' },
      })

      const registerResponse = await registerPOST(registerRequest)
      const registerData = await registerResponse.json()

      expect(registerResponse.status).toBe(400)
      expect(registerData.message).toBe('Invalid input data')
      expect(mockPrismaUser.findUnique).not.toHaveBeenCalled()
    })

    it('should handle SQL injection attempts safely', async () => {
      const maliciousData = {
        name: "'; DROP TABLE users; --",
        email: 'hacker@example.com',
        password: 'password123',
      }

      // The Zod validation should catch this, but let's test the flow
      mockPrismaUser.findUnique.mockResolvedValue(null)
      mockHash.mockResolvedValue('hashed_password')
      mockPrismaUser.create.mockResolvedValue({
        id: 'safe_user_123',
        name: maliciousData.name, // Prisma handles this safely
        email: maliciousData.email,
        password: 'hashed_password',
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const registerRequest = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(maliciousData),
        headers: { 'Content-Type': 'application/json' },
      })

      const registerResponse = await registerPOST(registerRequest)

      // Should succeed because Prisma handles SQL injection safely
      expect(registerResponse.status).toBe(201)
      expect(mockPrismaUser.create).toHaveBeenCalledWith({
        data: {
          name: maliciousData.name,
          email: maliciousData.email,
          password: 'hashed_password',
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      })
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle database connection failures gracefully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }

      mockPrismaUser.findUnique.mockRejectedValue(new Error('Database connection failed'))

      const registerRequest = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' },
      })

      const registerResponse = await registerPOST(registerRequest)
      const registerData = await registerResponse.json()

      expect(registerResponse.status).toBe(500)
      expect(registerData.message).toBe('Internal server error')
    })

    it('should handle bcrypt hashing failures', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }

      mockPrismaUser.findUnique.mockResolvedValue(null)
      mockHash.mockRejectedValue(new Error('Hashing failed'))

      const registerRequest = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' },
      })

      const registerResponse = await registerPOST(registerRequest)
      const registerData = await registerResponse.json()

      expect(registerResponse.status).toBe(500)
      expect(registerData.message).toBe('Internal server error')
    })
  })

  describe('OAuth Integration Simulation', () => {
    it('should handle Google OAuth provider configuration', () => {
      const googleProvider = authOptions.providers?.find(
        (provider) => provider.id === 'google'
      )

      expect(googleProvider).toBeDefined()
      expect(googleProvider?.type).toBe('oauth')
    })

    it('should handle OAuth user without password in credentials login', async () => {
      const oauthUser = {
        id: 'oauth_user_123',
        name: 'OAuth User',
        email: 'oauth@example.com',
        password: null, // OAuth users don't have passwords
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const credentialsProvider = authOptions.providers?.find(
        (provider) => provider.id === 'credentials'
      ) as any

      mockPrismaUser.findUnique.mockResolvedValue(oauthUser)

      const loginResult = await credentialsProvider.authorize({
        email: 'oauth@example.com',
        password: 'anypassword',
      })

      expect(loginResult).toBeNull() // Should fail because OAuth user has no password
      expect(mockCompare).not.toHaveBeenCalled()
    })
  })
})