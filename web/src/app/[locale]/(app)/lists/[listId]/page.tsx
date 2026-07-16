'use client';

import DataTablePanel from '@/features/app/components/DataTablePanel/DataTablePanel';
import TopBar from '@/features/app/components/TopBar/TopBar';
import Content from '@/features/app/layouts/Content/Content';
import { buildListItemTableRows } from '@/features/vocab-items/helpers';
import { ContentHeader } from '@/features/app/layouts/Content/ContentHeader';
import LangBadges from '@/features/app/components/Badges/LangBadges';
import Button from '@/components/ui/Button/Button';
import ProgressBar from '@/components/ui/ProgressBar/ProgressBar';
import Card from '@/components/ui/Card/Card';
import { cn } from '@/lib/utils';
import { mockItemData } from '@/features/vocab-items/mocks/mockItems';
import { itemColumnConfigData } from '@/features/vocab-items/columns';

const tableData = {
  columns: itemColumnConfigData,
  rows: buildListItemTableRows(mockItemData),
  isSelectable: true,
  hasControls: true,
};

interface PageProps {
  params: { listId: string };
}

const miniTextClass = 'text-[12px] text-(--text-dim)';
const largeTextClass = 'text-[22px] font-bold';

function page({ params }: PageProps) {
  const { listId } = params;

  return (
    <>
      <TopBar path={listId} title="Vocabulary List" />
      <Content>
        <ContentHeader
          eyebrow={<LangBadges sourceLang="en" targetLang="fr" />}
          title="Vocabulary List Title"
          backLink="/lists"
        >
          <Button icon="play" title="Practice" onClick={() => {}}>
            Practice
          </Button>
        </ContentHeader>
        <Card hasBorder className="panel mb-5 py-5 px-6 flex  gap-6 flex-wrap">
          <div>
            <div className={miniTextClass}>Words</div>
            <div className={largeTextClass}>35</div>
          </div>
          <div>
            <div className={miniTextClass}>Mastered</div>
            <div className={cn(largeTextClass, 'text-(--success)')}>22</div>
          </div>
          <div>
            <div className={miniTextClass}>Last practiced</div>
            <div className={cn(largeTextClass, 'font-[600')}>2d ago</div>
          </div>
          <div className="flex-1 min-w-45 flex flex-col">
            <div className={miniTextClass}>Mastery · 63%</div>
            <div className="flex-1 flex items-center">
              <ProgressBar showPercent={false} progress={63} size="large" />
            </div>
          </div>
        </Card>
        <DataTablePanel
          headerProps={{
            title: 'All lists',
            smallText: '10 of 10',
            showAddButton: true,
            showSearch: true,
            showLanguageFilter: true,
            addButtonLabel: 'New list',
            searchPlaceholder: 'Search lists',
            searchInputChangeHandler: () => {},
            addButtonClickHandler: () => {},
            languageFilterClickHandler: () => {},
          }}
          tableProps={tableData}
        />
      </Content>
    </>
  );
}

export default page;
