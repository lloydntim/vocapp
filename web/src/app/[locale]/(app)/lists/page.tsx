'use client';

import DataTablePanel from '@/features/app/components/DataTablePanel/DataTablePanel';
import TopBar from '@/features/app/components/TopBar/TopBar';
import Content from '@/features/app/layouts/Content/Content';
import { listColumnConfigData } from '@/features/vocab-lists/columns';
import { mockListData } from '@/features/vocab-lists/mocks/mockLists';
import { buildListTableRows } from '@/features/vocab-lists/helpers';

const tableData = {
  columns: listColumnConfigData,
  rows: buildListTableRows(mockListData),
  isSelectable: true,
  hasControls: true,
};

interface PageProps {
  params: { lists: string };
}

function page({ params }: PageProps) {
  const { lists } = params;

  return (
    <>
      <TopBar path={lists} title="Vocabulary Lists" />
      <Content>
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
