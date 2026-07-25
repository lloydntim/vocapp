# Making `clientApi` Work in the Browser and on the Server

## The idea in plain language

The existing `rawFetch()` function sends requests to addresses like:

```text
/api/users/me
```

That is a relative URL: it describes the path but does not say which website
should receive the request.

A browser can fill in the missing information because it knows which page is
open. If the current page is:

```text
http://localhost:3001/en/lists/123/items
```

the browser understands that `/api/users/me` means:

```text
http://localhost:3001/api/users/me
```

The server does not have an open page to use as a reference. Node's `fetch()`
needs a complete URL, so giving it only `/api/users/me` can produce:

```text
TypeError: Failed to parse URL
```

The fix teaches `rawFetch()` to behave differently in its two environments:

- In the browser, keep using the relative `/api/...` URL. The browser supplies
  the current origin and sends matching cookies normally.
- On the server, create a complete URL using the incoming request's protocol
  and host. Also forward the incoming cookie header so the internal API route
  can identify the same signed-in user.

Because the change is made in `rawFetch()`, every query that goes through
`clientApi()` receives the same behavior. Individual pages do not need to
repeat URL-building or cookie-forwarding logic.

## Before the change

The request flow currently looks like this:

```text
Browser query
  → clientApi('/users/me')
  → rawFetch('/users/me')
  → fetch('/api/users/me')
  → succeeds

Server-rendered query
  → clientApi('/users/me')
  → rawFetch('/users/me')
  → fetch('/api/users/me')
  → fails because the URL has no origin
```

The existing implementation in `web/src/lib/client-api.ts` is:

```ts
export async function rawFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  return fetch(`/api${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
}
```

This implementation is correct for browser requests. It simply does not have
enough information to make the same request during server rendering.

## Step 1: Open the shared API helper

Open:

```text
web/src/lib/client-api.ts
```

`rawFetch()` is the right place for the change because all feature API modules
already call it indirectly through `clientApi()`.

For example:

```ts
export async function getCurrentUser() {
  const response = await clientApi<{ data: User }>('/users/me');
  return response.data;
}
```

Fixing the shared transport makes this function usable in either environment
without adding special cases to `getCurrentUser()` itself.

## Step 2: Add environment-aware helpers

Add these functions above `rawFetch()`:

```ts
async function resolveBaseUrl(): Promise<string> {
  if (typeof window !== 'undefined') return '';

  const { headers } = await import('next/headers');
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') ?? 'http';

  return `${protocol}://${host}`;
}

async function resolveCookieHeader(): Promise<string | undefined> {
  if (typeof window !== 'undefined') return undefined;

  const { headers } = await import('next/headers');
  const headersList = await headers();
  return headersList.get('cookie') ?? undefined;
}
```

### What `typeof window` means

Browsers provide a global object named `window`. Node does not.

This check therefore asks, in a dependency-free way, whether the code is
running in a browser:

```ts
typeof window !== 'undefined'
```

The use of `typeof` is important. Reading `window` directly on the server would
throw because it does not exist, while `typeof window` safely returns
`'undefined'`.

The helper returns an empty base URL in the browser:

```ts
if (typeof window !== 'undefined') return '';
```

As a result:

```ts
`${baseUrl}/api${path}`
```

still becomes:

```text
/api/users/me
```

This is functionally the same browser request as before.

### Why `next/headers` is imported dynamically

`next/headers` provides request-specific server information. It should not be
part of code that the browser executes.

A normal top-level import would make the server-only dependency part of a
module that is also used by Client Components:

```ts
// Do not use this at the top of this shared file.
import { headers } from 'next/headers';
```

Instead, the code loads it only after establishing that it is on the server:

```ts
const { headers } = await import('next/headers');
```

This keeps the browser branch free from a direct server-only import.

### What the base-URL helper does

For an incoming development request, the headers might include:

```text
host: localhost:3001
x-forwarded-proto: http
```

The helper combines them into:

```text
http://localhost:3001
```

It can then turn:

```text
/api/users/me
```

into:

```text
http://localhost:3001/api/users/me
```

That is a complete URL that server-side `fetch()` can understand.

In production, a trusted reverse proxy will commonly provide:

```text
host: app.example.com
x-forwarded-proto: https
```

which produces:

```text
https://app.example.com
```

### Why the cookie header must be copied

When the browser calls the API on the same origin, it automatically attaches
matching cookies. A server-side `fetch()` is a new outgoing request; it does
not automatically inherit the cookies from the incoming browser request.

The helper reads the original header:

```ts
headersList.get('cookie')
```

`rawFetch()` can then copy it to the internal API request. This matters because
the API route reads cookies such as `accessToken` to determine who is signed
in.

The cookie value remains `undefined` in the browser because browser JavaScript
should not manually construct a `Cookie` header. The browser owns that process,
and forbidden-header rules prevent client code from setting it directly.

## Step 3: Use the helpers in `rawFetch`

Replace the original function with:

```ts
export async function rawFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const baseUrl = await resolveBaseUrl();
  const cookieHeader = await resolveCookieHeader();

  return fetch(`${baseUrl}/api${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(options?.headers || {}),
    },
  });
}
```

The order of the header spreads is intentional:

```ts
{
  'Content-Type': 'application/json',
  ...(cookieHeader ? { Cookie: cookieHeader } : {}),
  ...(options?.headers || {}),
}
```

Explicit headers supplied by the caller come last, so they can override the
defaults when needed.

## After the change

The browser path is:

```text
resolveBaseUrl()       → ''
resolveCookieHeader()  → undefined
final URL              → /api/users/me
cookies                → attached by the browser
```

The server path is:

```text
resolveBaseUrl()       → http://localhost:3001
resolveCookieHeader()  → accessToken=...
final URL              → http://localhost:3001/api/users/me
cookies                → copied into the outgoing request
```

The complete flow becomes:

```text
Browser query
  → clientApi('/users/me')
  → fetch('/api/users/me')
  → browser attaches cookies
  → API route sees the signed-in user

Server-rendered query
  → clientApi('/users/me')
  → read protocol, host, and cookies from the incoming request
  → fetch('http://localhost:3001/api/users/me')
  → copied Cookie header reaches the API route
  → API route sees the same signed-in user
```

## Example with a vocabulary-list request

Suppose a query calls:

```ts
clientApi(`/users/${userId}/lists/${listId}/items`);
```

If the values are:

```ts
const userId = 'user-42';
const listId = 'list-17';
```

the path passed to `rawFetch()` is:

```text
/users/user-42/lists/list-17/items
```

In the browser, the final request is:

```text
/api/users/user-42/lists/list-17/items
```

During local server rendering, it becomes:

```text
http://localhost:3001/api/users/user-42/lists/list-17/items
```

The feature API code does not need to know which version to build.

## How this differs from query hydration

Query hydration and an environment-aware `rawFetch()` solve related but
different problems.

Hydration places data fetched by the server into TanStack Query's browser cache
so the browser can reuse it. It is useful for avoiding duplicate requests and
showing prefetched data immediately.

This `rawFetch()` change makes the request itself valid in both environments.
It applies automatically to current and future queries that use `clientApi()`.

The two approaches can also be used together:

- Use environment-aware fetching so server queries are always capable of
  making valid authenticated requests.
- Use hydration where reusing prefetched data improves performance or avoids
  an unnecessary second request.

This change removes the need to add hydration solely to prevent relative-URL
errors. Hydration may still be valuable for data-loading performance.

## Security and deployment note

The example builds an outgoing URL from incoming request headers:

```ts
const host = headersList.get('host');
const protocol = headersList.get('x-forwarded-proto') ?? 'http';
```

Only use this pattern when the deployment platform or reverse proxy validates
and controls those headers. If an untrusted client can freely choose `Host` or
`X-Forwarded-Proto`, using those values for an authenticated server-side
request can send cookies to an unintended destination.

A safer option for deployments with a known public origin is to configure it:

```env
APP_ORIGIN=https://app.example.com
```

Then prefer the configured value on the server:

```ts
async function resolveBaseUrl(): Promise<string> {
  if (typeof window !== 'undefined') return '';

  const configuredOrigin = process.env.APP_ORIGIN;
  if (configuredOrigin) return configuredOrigin;

  const { headers } = await import('next/headers');
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') ?? 'http';

  if (!host) {
    throw new Error('Cannot resolve the application origin');
  }

  return `${protocol}://${host}`;
}
```

Whichever version is used, validate that `host` exists. Returning
`http://null` would hide the real configuration problem behind a confusing
network error.

Forward the incoming cookies only to the application's own trusted origin.
Never reuse this helper to call arbitrary user-supplied URLs.

## Request-time rendering note

On the server, `headers()` reads values from the current incoming request.
That makes the operation request-specific. It should not run inside a shared
server cache whose result can be reused between users.

This is appropriate for authenticated data, because the response depends on
the current user's cookies and should be resolved at request time.

## Step 4: Verify the change

Run or restart the development server from `web/`:

```bash
pnpm dev
```

A restart is normally unnecessary for a source edit, but it is reasonable if
Turbopack appears to retain a stale error.

### Test server rendering

Open a list page by entering its URL directly or performing a hard refresh:

```text
http://localhost:3001/en/lists/0679a5d4-.../items
```

Do not rely only on client-side navigation. A direct load ensures that the
route passes through server rendering.

In the terminal running `pnpm dev`, confirm that this error is gone:

```text
TypeError: Failed to parse URL
```

In the browser, also confirm that this fallback message no longer appears:

```text
Switched to client rendering because the server rendering errored
```

### Test cookie forwarding

Confirm that the page renders the expected signed-in user's data.

In browser developer tools:

1. Open **Application**.
2. Open **Cookies** for `http://localhost:3001`.
3. Confirm that the expected authentication cookie exists.
4. Compare the user shown by the page with the account represented by the
   active session.

This verifies that the server-side internal request carried the incoming
cookie to the API route.

Also test a signed-out or expired session. It should still return the expected
unauthorized behavior rather than accidentally rendering another user's data.

### Run project checks

From `web/`, run:

```bash
pnpm lint
pnpm build
```

These commands verify the shared module's client/server boundary and catch
type or bundling errors caused by the dynamic server-only import.

## Troubleshooting

### The server still reports `Failed to parse URL`

Log or inspect the resolved server URL and confirm that `host` is present. The
final value must be absolute:

```text
http://localhost:3001/api/...
```

not:

```text
/api/...
```

### The API returns `401` only during server rendering

The URL is probably valid, but the authentication cookie may not be reaching
the API route. Confirm that:

- The incoming request has a `cookie` header.
- `resolveCookieHeader()` runs on the server.
- The caller does not accidentally replace the forwarded `Cookie` header.
- The internal request is sent only to the trusted application origin.

### The client build reports a `next/headers` error

Confirm that there is no top-level import from `next/headers` in the shared
module. It must remain inside the server-only branch:

```ts
const { headers } = await import('next/headers');
```

### The production URL uses the wrong protocol

Make sure the trusted reverse proxy sets `X-Forwarded-Proto` correctly, or use
a configured `APP_ORIGIN` instead of deriving the origin from request headers.

## Final result

`clientApi()` keeps one interface across the application:

```ts
clientApi('/users/me');
```

In the browser, it sends a normal relative request and lets the browser handle
cookies. During server rendering, it builds a complete application URL and
forwards the current request's cookies. Queries can therefore use the shared
API client in either environment without failing on a relative URL.
