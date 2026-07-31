import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Decorator } from '@storybook/nextjs-vite';
import { currentUserQueryKey } from '@/features/auth/query-keys';
import { User } from '@/features/auth/types';

export const mockCurrentUser: User = {
  id: 'story-user-1',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  username: 'ada',
  isVerified: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  role: 'USER',
  plan: 'FREE',
};

/** Provides a QueryClient pre-seeded with a mock current user, so
 * components using `useCurrentUser()` (a suspense query) don't suspend
 * or hit the network when rendered in isolation. */
export const withQueryClient: Decorator = (Story) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  queryClient.setQueryData(currentUserQueryKey, { data: mockCurrentUser });

  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};
