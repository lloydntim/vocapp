import SideNavSection from './SideNavSection';
import SideNavItem from './SideNavItem';
import type { sideNavData } from './data';

interface SideNavSectionsProps {
  data: typeof sideNavData;
}

export default function SideNavSections({ data }: SideNavSectionsProps) {
  return (
    <>
      {Object.entries(data).map(([section, items]) => (
        <SideNavSection key={section} title={section}>
          {items.map((item) => (
            <SideNavItem key={item.href} {...item} />
          ))}
        </SideNavSection>
      ))}
    </>
  );
}