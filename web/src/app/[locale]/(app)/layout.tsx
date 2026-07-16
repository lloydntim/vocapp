import { PropsWithChildren } from 'react';
import SideNav from '@/components/layout/SideNav/SideNav';
import SideNavHeader from '@/components/layout/SideNav/SideNavHeader';
import SideNavSections from '@/components/layout/SideNav/SideNavSections';
import SideNavFooter from '@/components/layout/SideNav/SideNavFooter';
import { sideNavData } from '@/components/layout/SideNav/data';

const mainClass = 'flex flex-1 flex-col min-w-0 bg-(--bg)';

async function layout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen bg-(--bg)">
      <SideNav>
        <SideNavHeader logo={{ href: '/dashboard', title: 'Back to home' }} />
        <SideNavSections data={sideNavData} />
        <SideNavFooter
          user={{ firstName: 'John', lastName: 'Doe', plan: 'Free' }}
        />
      </SideNav>

      <div className={mainClass}>{children}</div>
    </div>
  );
}

export default layout;
