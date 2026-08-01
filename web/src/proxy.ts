import createMidleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { apiRequest } from './features/auth/server/api';
import { NextRequest } from 'next/server';

const intlMiddleware = createMidleware(routing);

const PROTECTED_ROUTES = ['lists', 'dashboard', 'settings', 'profile', 'stats'];

function isProtectedRoute(pathname: string): boolean {
  const [, maybeLocale, maybeRoute] = pathname.split('/');
  const route = (routing.locales as readonly string[]).includes(maybeLocale)
    ? maybeRoute
    : maybeLocale;
  return PROTECTED_ROUTES.includes(route);
}

const ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 2 * 60,
};

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

// A refresh token can only be used once. If several requests hit this at
// the same moment (e.g. prefetching multiple pages right as the access
// token expires), they'd all try to use the same refresh token — only one
// would succeed, and the rest would get logged out by mistake. This map
// lets those requests share a single refresh instead of racing.
const pendingRefreshes = new Map<string, Promise<RefreshResult | null>>();

function refreshAccessToken(refreshToken: string): Promise<RefreshResult | null> {
  let pending = pendingRefreshes.get(refreshToken);

  if (!pending) {
    pending = apiRequest('/auth/refresh', {
      method: 'POST',
      headers: { Cookie: `refreshToken=${refreshToken}` },
    })
      .then(async (response) => {
        if (!response.ok) return null;
        const result = await response.json();
        return { accessToken: result.accessToken, refreshToken: result.refreshToken };
      })
      .catch((error) => {
        // apiRequest can throw (network failure, timeout) rather than
        // resolve to a Response — without this, that rejection would
        // propagate out of the unguarded `await` in proxy() below and
        // fail the whole navigation instead of just falling through to
        // an unauthenticated page load.
        console.error('Silent access-token refresh failed:', error);
        return null;
      })
      .finally(() => {
        pendingRefreshes.delete(refreshToken);
      });
    pendingRefreshes.set(refreshToken, pending);
  }

  return pending;
}

export default async function proxy(request: NextRequest) {
  if (isProtectedRoute(request.nextUrl.pathname)) {
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!accessToken && refreshToken) {
      const result = await refreshAccessToken(refreshToken);

      if (result) {
        // make the refreshed token visible to *this* request's render
        request.cookies.set('accessToken', result.accessToken);

        const response = intlMiddleware(request);
        // and persist it to the browser for future requests
        response.cookies.set(
          'accessToken',
          result.accessToken,
          ACCESS_TOKEN_COOKIE_OPTIONS,
        );
        response.cookies.set(
          'refreshToken',
          result.refreshToken,
          REFRESH_TOKEN_COOKIE_OPTIONS,
        );
        return response;
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
