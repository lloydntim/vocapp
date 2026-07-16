'use client';

import TopBar from '@/features/app/components/TopBar/TopBar';
import Content from '@/features/app/layouts/Content/Content';
import ProfileCard from '@/features/profile/components/ProfileCard/ProfileCard';
import ProfileDetails from '@/features/profile/components/ProfileDetails/ProfileDetails';
import { mockProfileDetailsCards } from '@/features/profile/mocks/mockProfileDetailsCards';

function page() {
  return (
    <>
      <TopBar path="Account" title="User profile" />
      <Content className="grid gap-6 grid-cols-[280px_1fr]">
        <ProfileCard
          initials="JD"
          name="John Doe"
          email="john.doe@example.com"
          isVerified
          buttons={[
            {
              label: 'Edit',
              icon: 'pen-line',
              rank: 'secondary',
              onClick: () => {},
            },
            { label: 'Logout', icon: 'log-out', onClick: () => {} },
          ]}
        />
        <ProfileDetails cards={mockProfileDetailsCards} />
      </Content>
    </>
  );
}

export default page;
