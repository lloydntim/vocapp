import { PropsWithChildren, Suspense } from 'react';
import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
import SideNav from '@/components/layout/SideNav/SideNav';
import SideNavHeader from '@/components/layout/SideNav/SideNavHeader';
import SideNavSections from '@/components/layout/SideNav/SideNavSections';
import SideNavFooter from '@/components/layout/SideNav/SideNavFooter';
import { sideNavData } from '@/components/layout/SideNav/data';
import { apiRequest } from '@/features/auth/server/api';
import OverlayLoader from '@/components/ui/OverlayLoader/OverlayLoader';
import AuthErrorBoundary from '@/features/auth/components/AuthErrorBoundary/AuthErrorBoundary';
import { redirect } from '@/i18n/navigation';
import { getQueryClient } from '@/lib/query-client';
import { currentUserQueryKey } from '@/features/auth/query-keys';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

const mainClass = 'flex flex-1 flex-col min-w-0 bg-(--bg)';

interface LayoutProps extends PropsWithChildren {
  params: Promise<{
    locale: string;
  }>;
}

async function AppLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    redirect({ href: '/login', locale });
  }

  const response = await apiRequest('/users/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    redirect({ href: '/login', locale });
  }

  const { data: user } = await response.json();
  const { firstName, lastName, plan } = user;

  const listsResponse = await apiRequest(`/users/${user.id}/lists`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const currentUserListsQueryKey = ['lists', user.id];

  const queryClient = getQueryClient();
  queryClient.setQueryData(currentUserQueryKey, { data: user });

  if (listsResponse.ok) {
    const listsResult = await listsResponse.json();
    queryClient.setQueryData(currentUserListsQueryKey, listsResult);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-screen bg-(--bg)">
        <SideNav>
          <SideNavHeader logo={{ href: '/dashboard', title: 'Back to home' }} />
          <SideNavSections data={sideNavData} />
          <SideNavFooter user={{ firstName, lastName, plan }} />
        </SideNav>

        <div className={mainClass}>
          <AuthErrorBoundary>
            <Suspense fallback={<OverlayLoader />}>{children}</Suspense>
          </AuthErrorBoundary>
        </div>
      </div>
    </HydrationBoundary>
  );
}

export default AppLayout;
