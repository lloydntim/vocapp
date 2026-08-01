'use client';

import { useSearchParams } from 'next/navigation';
import SideNavSection from './SideNavSection';
import SideNavItem, { SideNavItemProps } from './SideNavItem';
import { usePathname } from '@/i18n/navigation';
import { useListsQuery } from '@/features/vocab-lists/hooks';
import { getLanguageUsage } from '@/features/vocab-lists/helpers';
import { useGetLanguages } from '@/features/languages/hooks';
import { buildLanguageNameMap } from '@/features/languages/helpers';

interface SideNavSectionsProps {
  data: { main: SideNavItemProps[]; account: SideNavItemProps[] };
}

export default function SideNavSections({ data }: SideNavSectionsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: lists } = useListsQuery();
  const { data: languagesData } = useGetLanguages();

  const listCount = lists?.length ?? 0;
  const languageNameMap = buildLanguageNameMap(languagesData?.languages);

  const languageItems: SideNavItemProps[] = getLanguageUsage(lists).map(
    ({ languageCode, count }) => ({
      flag: languageCode,
      href: `/lists?language=${languageCode}`,
      text: languageNameMap[languageCode] ?? languageCode.toUpperCase(),
      pill: count,
    }),
  );

  const sections: Record<string, SideNavItemProps[]> = {
    main: data.main,
    languages: languageItems,
    account: data.account,
  };

  const isItemActive = (href: string) => {
    const [hrefPath, hrefQuery] = href.split('?');
    const pathMatches =
      hrefPath === pathname || pathname.startsWith(`${hrefPath}/`);

    if (!hrefQuery) return pathMatches;

    const hrefParams = new URLSearchParams(hrefQuery);
    return (
      pathMatches &&
      Array.from(hrefParams.entries()).every(
        ([key, value]) => searchParams.get(key) === value,
      )
    );
  };

  return (
    <>
      {Object.entries(sections).map(([section, items]) =>
        items.length > 0 ? (
          <SideNavSection key={section} title={section}>
            {items.map((item) => (
              <SideNavItem
                key={item.href}
                {...item}
                pill={item.href === '/lists' ? listCount : item.pill}
                isActive={isItemActive(item.href)}
              />
            ))}
          </SideNavSection>
        ) : null,
      )}
    </>
  );
}
