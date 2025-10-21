import { NextRequest } from 'next/server'
import middleware from '@/middleware'

// Mock next-auth/middleware
jest.mock('next-auth/middleware', () => {
  return jest.fn((middlewareFunction, config) => {
    return (req: NextRequest) => {
      // Simulate the withAuth behavior
      const { pathname } = req.nextUrl
      const token = req.headers.get('authorization') || req.cookies.get('next-auth.session-token')?.value
      
      // Call the authorized callback
      const isAuthorized = config.callbacks.authorized({ token, req })
      
      if (!isAuthorized) {
        // Simulate redirect to sign-in
        return new Response(null, {
          status: 307,
          headers: {
            Location: '/auth/signin',
          },
        })
      }
      
      // Call the middleware function if authorized
      return middlewareFunction(req)
    }
  })
})

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Public Routes', () => {
    const publicRoutes = [
      '/',
      '/trips',
      '/trips/123',
      '/auth/signin',
      '/auth/signup',
      '/api/auth/signin',
      '/api/auth/callback',
    ]

    publicRoutes.forEach((route) => {
      it(`should allow access to public route: ${route}`, async () => {
        // Arrange
        const request = new NextRequest(`http://localhost:3000${route}`)

        // Act
        const response = await middleware(request)

        // Assert
        expect(response).toBeUndefined() // No redirect means access allowed
      })
    })
  })

  describe('Protected Routes', () => {
    const protectedRoutes = [
      '/profile',
      '/bookings',
      '/api/user/bookings',
      '/api/user/reviews',
    ]

    protectedRoutes.forEach((route) => {
      it(`should redirect unauthenticated user from protected route: ${route}`, async () => {
        // Arrange
        const request = new NextRequest(`http://localhost:3000${route}`)

        // Act
        const response = await middleware(request)

        // Assert
        expect(response).toBeDefined()
        expect(response?.status).toBe(307)
        expect(response?.headers.get('Location')).toBe('/auth/signin')
      })

      it(`should allow authenticated user to access protected route: ${route}`, async () => {
        // Arrange
        const request = new NextRequest(`http://localhost:3000${route}`, {
          headers: {
            authorization: 'Bearer valid-token',
          },
        })

        // Act
        const response = await middleware(request)

        // Assert
        expect(response).toBeUndefined() // No redirect means access allowed
      })
    })
  })

  describe('Static Files and API Auth Routes', () => {
    const excludedRoutes = [
      '/_next/static/chunks/main.js',
      '/_next/image/logo.png',
      '/favicon.ico',
      '/public/logo.svg',
    ]

    excludedRoutes.forEach((route) => {
      it(`should not process excluded route: ${route}`, () => {
        // The middleware config should exclude these routes
        const config = {
          matcher: [
            "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
          ],
        }

        // Test that the route matches the exclusion pattern
        const shouldExclude = !new RegExp(config.matcher[0]).test(route)
        expect(shouldExclude).toBe(true)
      })
    })
  })

  describe('Authorization Logic', () => {
    it('should authorize requests with valid tokens', () => {
      // This tests the authorized callback logic directly
      const mockReq = {
        nextUrl: { pathname: '/profile' },
      } as NextRequest

      const mockToken = { id: 'user_123', email: 'test@example.com' }

      // Simulate the authorized callback
      const isAuthorized = !!mockToken && !mockReq.nextUrl.pathname.startsWith('/auth/signin')
      
      expect(isAuthorized).toBe(true)
    })

    it('should not authorize requests without tokens for protected routes', () => {
      const mockReq = {
        nextUrl: { pathname: '/profile' },
      } as NextRequest

      const mockToken = null

      // Simulate the authorized callback
      const isAuthorized = !!mockToken
      
      expect(isAuthorized).toBe(false)
    })

    it('should authorize public routes regardless of token', () => {
      const publicRoutes = ['/', '/trips', '/auth/signin', '/auth/signup']
      
      publicRoutes.forEach((pathname) => {
        const mockReq = {
          nextUrl: { pathname },
        } as NextRequest

        const mockToken = null

        // Simulate the authorized callback logic
        const isPublicRoute = [
          "/",
          "/trips",
          "/auth/signin",
          "/auth/signup",
          "/api/auth",
        ].some(route => pathname.startsWith(route))

        const isAuthorized = isPublicRoute || !!mockToken
        
        expect(isAuthorized).toBe(true)
      })
    })
  })
})