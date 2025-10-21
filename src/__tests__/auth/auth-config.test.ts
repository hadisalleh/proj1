import { compare } from 'bcryptjs'

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

import { authOptions } from '@/lib/auth'

const mockPrismaUser = require('@/lib/db').db.user

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}))

const mockCompare = compare as jest.MockedFunction<typeof compare>

describe('NextAuth Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Credentials Provider', () => {
    const credentialsProvider = authOptions.providers?.find(
      (provider) => provider.id === 'credentials'
    ) as any

    it('should have credentials provider configured', () => {
      expect(credentialsProvider).toBeDefined()
      expect(credentialsProvider.name).toBe('Credentials')
    })

    describe('authorize function', () => {
      it('should return null for missing credentials', async () => {
        // Act
        const result = await credentialsProvider.authorize({})

        // Assert
        expect(result).toBeNull()
        expect(mockPrismaUser.findUnique).not.toHaveBeenCalled()
      })

      it('should return null for invalid email format', async () => {
        // Arrange
        const credentials = {
          email: 'invalid-email',
          password: 'password123',
        }

        // Act
        const result = await credentialsProvider.authorize(credentials)

        // Assert
        expect(result).toBeNull()
        expect(mockPrismaUser.findUnique).not.toHaveBeenCalled()
      })

      it('should return null for short password', async () => {
        // Arrange
        const credentials = {
          email: 'test@example.com',
          password: '123', // Too short
        }

        // Act
        const result = await credentialsProvider.authorize(credentials)

        // Assert
        expect(result).toBeNull()
        expect(mockPrismaUser.findUnique).not.toHaveBeenCalled()
      })

      it('should return null for non-existent user', async () => {
        // Arrange
        const credentials = {
          email: 'nonexistent@example.com',
          password: 'password123',
        }

        mockPrismaUser.findUnique.mockResolvedValue(null)

        // Act
        const result = await credentialsProvider.authorize(credentials)

        // Assert
        expect(result).toBeNull()
        expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
          where: { email: credentials.email },
        })
      })

      it('should return null for user without password', async () => {
        // Arrange
        const credentials = {
          email: 'oauth@example.com',
          password: 'password123',
        }

        const oauthUser = {
          id: 'oauth_user_123',
          email: credentials.email,
          name: 'OAuth User',
          password: null, // OAuth user without password
          phone: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        mockPrismaUser.findUnique.mockResolvedValue(oauthUser)

        // Act
        const result = await credentialsProvider.authorize(credentials)

        // Assert
        expect(result).toBeNull()
        expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
          where: { email: credentials.email },
        })
        expect(mockCompare).not.toHaveBeenCalled()
      })

      it('should return null for incorrect password', async () => {
        // Arrange
        const credentials = {
          email: 'user@example.com',
          password: 'wrongpassword',
        }

        const user = {
          id: 'user_123',
          email: credentials.email,
          name: 'Test User',
          password: 'hashed_correct_password',
          phone: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        mockPrismaUser.findUnique.mockResolvedValue(user)
        mockCompare.mockResolvedValue(false)

        // Act
        const result = await credentialsProvider.authorize(credentials)

        // Assert
        expect(result).toBeNull()
        expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
          where: { email: credentials.email },
        })
        expect(mockCompare).toHaveBeenCalledWith(credentials.password, user.password)
      })

      it('should return user object for valid credentials', async () => {
        // Arrange
        const credentials = {
          email: 'user@example.com',
          password: 'correctpassword',
        }

        const user = {
          id: 'user_123',
          email: credentials.email,
          name: 'Test User',
          password: 'hashed_correct_password',
          phone: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        mockPrismaUser.findUnique.mockResolvedValue(user)
        mockCompare.mockResolvedValue(true)

        // Act
        const result = await credentialsProvider.authorize(credentials)

        // Assert
        expect(result).toEqual({
          id: user.id,
          email: user.email,
          name: user.name,
        })
        expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
          where: { email: credentials.email },
        })
        expect(mockCompare).toHaveBeenCalledWith(credentials.password, user.password)
      })
    })
  })

  describe('JWT Callback', () => {
    it('should add user id to token when user is present', async () => {
      // Arrange
      const token = { email: 'test@example.com' }
      const user = { id: 'user_123', email: 'test@example.com', name: 'Test User' }

      // Act
      const result = await authOptions.callbacks?.jwt?.({ token, user } as any)

      // Assert
      expect(result).toEqual({
        email: 'test@example.com',
        id: 'user_123',
      })
    })

    it('should return token unchanged when user is not present', async () => {
      // Arrange
      const token = { email: 'test@example.com', id: 'existing_id' }

      // Act
      const result = await authOptions.callbacks?.jwt?.({ token } as any)

      // Assert
      expect(result).toEqual(token)
    })
  })

  describe('Session Callback', () => {
    it('should add user id to session from token', async () => {
      // Arrange
      const session = {
        user: { email: 'test@example.com', name: 'Test User' },
        expires: '2024-12-31',
      }
      const token = { id: 'user_123', email: 'test@example.com' }

      // Act
      const result = await authOptions.callbacks?.session?.({ session, token } as any)

      // Assert
      expect(result).toEqual({
        user: {
          email: 'test@example.com',
          name: 'Test User',
          id: 'user_123',
        },
        expires: '2024-12-31',
      })
    })

    it('should return session unchanged when token has no id', async () => {
      // Arrange
      const session = {
        user: { email: 'test@example.com', name: 'Test User' },
        expires: '2024-12-31',
      }
      const token = { email: 'test@example.com' }

      // Act
      const result = await authOptions.callbacks?.session?.({ session, token } as any)

      // Assert
      expect(result).toEqual(session)
    })
  })

  describe('Configuration', () => {
    it('should have correct session strategy', () => {
      expect(authOptions.session?.strategy).toBe('jwt')
    })

    it('should have correct sign-in page', () => {
      expect(authOptions.pages?.signIn).toBe('/auth/signin')
    })

    it('should have Google provider configured', () => {
      const googleProvider = authOptions.providers?.find(
        (provider) => provider.id === 'google'
      )
      expect(googleProvider).toBeDefined()
    })
  })
})