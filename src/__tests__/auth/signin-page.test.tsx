import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import SignInPage from '@/app/auth/signin/page'

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  getSession: jest.fn(),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
const mockGetSession = getSession as jest.MockedFunction<typeof getSession>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('SignInPage', () => {
  const mockPush = jest.fn()
  const mockRefresh = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    })
  })

  it('should render sign in form', () => {
    render(<SignInPage />)

    expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /create a new account/i })).toBeInTheDocument()
  })

  it('should prevent submission with invalid input', async () => {
    const user = userEvent.setup()
    render(<SignInPage />)

    const submitButton = screen.getByRole('button', { name: /^sign in$/i })
    
    // Submit form with invalid data
    await user.type(screen.getByLabelText(/email address/i), 'invalid-email')
    await user.type(screen.getByLabelText(/password/i), '123')
    await user.click(submitButton)

    // Should not call signIn with invalid data
    await waitFor(() => {
      expect(mockSignIn).not.toHaveBeenCalled()
    })
  })

  it('should allow form submission with valid input', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ ok: true, error: null } as any)
    
    render(<SignInPage />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /^sign in$/i })

    // Submit form with valid data
    await user.type(emailInput, 'valid@example.com')
    await user.type(passwordInput, 'validpassword123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'valid@example.com',
        password: 'validpassword123',
        redirect: false,
      })
    })
  })

  it('should handle successful sign in', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ ok: true, error: null } as any)
    mockGetSession.mockResolvedValue({} as any)

    render(<SignInPage />)

    await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      })
    })

    await waitFor(() => {
      expect(mockGetSession).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/')
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('should handle sign in error', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ ok: false, error: 'CredentialsSignin' } as any)

    render(<SignInPage />)

    await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    })

    expect(mockGetSession).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should handle Google sign in', async () => {
    const user = userEvent.setup()
    render(<SignInPage />)

    await user.click(screen.getByRole('button', { name: /sign in with google/i }))

    expect(mockSignIn).toHaveBeenCalledWith('google', { callbackUrl: '/' })
  })

  it('should show loading state during sign in', async () => {
    const user = userEvent.setup()
    mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<SignInPage />)

    await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    
    const submitButton = screen.getByRole('button', { name: /^sign in$/i })
    await user.click(submitButton)

    expect(screen.getByRole('button', { name: /signing in.../i })).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('should handle network errors gracefully', async () => {
    const user = userEvent.setup()
    mockSignIn.mockRejectedValue(new Error('Network error'))

    render(<SignInPage />)

    await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    await waitFor(() => {
      expect(screen.getByText(/an error occurred. please try again./i)).toBeInTheDocument()
    })
  })

  it('should have proper form accessibility', () => {
    render(<SignInPage />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('autoComplete', 'email')
    expect(emailInput).toBeRequired()

    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password')
    expect(passwordInput).toBeRequired()
  })
})