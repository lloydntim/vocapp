'use client';

import SideNavSection from './SideNavSection';
import SideNavItem, { SideNavItemProps } from './SideNavItem';
import { usePathname } from '@/i18n/navigation';
import { useListsQuery } from '@/features/vocab-lists/hooks';

interface SideNavSectionsProps {
  data: { main: SideNavItemProps[] };
}

export default function SideNavSections({ data }: SideNavSectionsProps) {
  const pathname = usePathname();
  const { data: lists } = useListsQuery();
  const listCount = lists?.length ?? 0;

  return (
    <>
      {Object.entries(data).map(([section, items]) => (
        <SideNavSection key={section} title={section}>
          {items.map((item) => (
            <SideNavItem
              key={item.href}
              {...item}
              pill={item.href === '/lists' ? listCount : item.pill}
              isActive={
                item.href === pathname || pathname.startsWith(`${item.href}/`)
              }
            />
          ))}
        </SideNavSection>
      ))}
    </>
  );
}
