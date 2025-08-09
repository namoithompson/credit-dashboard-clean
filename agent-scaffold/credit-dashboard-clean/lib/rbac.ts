import { currentUser, SessionUser } from './auth'
import { Role } from '@prisma/client'
import { NextResponse } from 'next/server'

/**
 * Helper to enforce role-based access control in API routes. If the
 * current user does not possess one of the required roles, throws an
 * HTTP 403 response.
 */
export async function requireRole(roles: Role[]): Promise<SessionUser> {
  const user = await currentUser()
  if (!user || !roles.includes(user.role)) {
    throw new NextResponse('Forbidden', { status: 403 })
  }
  return user
}