import { PrismaAdapter } from '@next-auth/prisma-adapter'
import type { NextAuthOptions, User as NextAuthUser } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from './prisma'
import { Role } from '@prisma/client'
import { getServerSession } from 'next-auth'

/**
 * Configure NextAuth with a simple credentials provider. In production you
 * should replace the password comparison with a robust hashing scheme (e.g. bcrypt).
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) return null
        // TODO: replace compare logic with hashed password comparison
        const isValid = user.password === credentials.password || await compare(credentials.password, user.password)
        if (!isValid) return null
        return user as unknown as NextAuthUser
      }
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Expose user id and role on session
      if (token && session.user) {
        session.user.id = token.sub as string
        session.user.role = (token.role as Role) || Role.CLIENT
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    }
  }
}

export async function currentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

export type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
  role: Role
}