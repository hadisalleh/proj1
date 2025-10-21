import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// Hardcoded user for testing - in production this would come from database
const TEST_USER = {
  id: 'test-user-id',
  email: 'test@cubaje.my',
  name: 'Test User',
  // This is the hash of 'P@ssword1234'
  passwordHash: '$2b$12$2/AnKKVfxwPP3zMt0hAhheRQlHxa3zKKwcuxz39UGMKT3NGUwu4X6'
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log('Simple auth called with:', { email: credentials?.email, hasPassword: !!credentials?.password })
          
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials')
            return null
          }

          const validatedFields = loginSchema.safeParse(credentials)
          if (!validatedFields.success) {
            console.log('Validation failed:', validatedFields.error)
            return null
          }

          const { email, password } = validatedFields.data
          
          // Check if it's our test user
          if (email !== TEST_USER.email) {
            console.log('User not found:', email)
            return null
          }

          console.log('Testing password for test user...')
          const isPasswordValid = await compare(password, TEST_USER.passwordHash)
          console.log('Password valid:', isPasswordValid)
          
          if (!isPasswordValid) {
            console.log('Invalid password')
            return null
          }

          console.log('Authentication successful!')
          return {
            id: TEST_USER.id,
            email: TEST_USER.email,
            name: TEST_USER.name,
          }
        } catch (error) {
          console.error('Error in simple auth:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}