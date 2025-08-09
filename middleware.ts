import { withAuth } from 'next-auth/middleware'

/**
 * Global authentication middleware. This protects all pages and API routes by
 * default, redirecting unauthenticated users to the login page. The setup
 * routes are left publicly accessible so that the first admin can be created.
 */
export default withAuth({
  pages: { signIn: '/login' },
  callbacks: {
    /**
     * Only allow access if a valid session token is present. The setup routes
     * (e.g. `/setup` and `/api/setup`) and the login page itself are exempt
     * from authentication so that a brand‑new installation can be configured.
     */
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl
      // Allow unauthenticated access to the setup flow and login page
      if (
        pathname.startsWith('/setup') ||
        pathname.startsWith('/api/setup') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/api/auth')
      ) {
        return true
      }
      // Otherwise require a valid session token
      return !!token
    },
  },
})

// Apply the middleware to all routes except Next.js internals and static assets
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}