import { timeAgo } from '@/lib/date';
import { DataTableRowItem } from '@/features/app/components/DataTablePanel/DataTable/types';
import { VocabList } from './types';
import { InputDataItem } from '@/components/ui/Form/Form';
import { AutoCompleteItem } from '@/components/ui/AutoComplete/AutoComplete';
import { VocabListPanelRowProps } from '../dashboard/VocabListPanel/VocabListPanel';
import { listColumnConfigData } from './columns';
import { CreateListFormValues, createListSchema } from './schemas';

const FORM_ID = 'create-list-form';

export const buildListTableRows = (data: VocabList[] | undefined) =>
  (data ?? []).map((row) => ({
    id: row.id,
    cells: [
      {
        type: 'primaryText',
        props: {
          to: `/lists/${row.id}`,
          type: 'primary',
          title: row.name,
          subtitle: `Created ${timeAgo(row.createdAt)}`,
        },
      },
      {
        type: 'badge',
        props: {
          sourceLang: row.sourceLanguageCode.toUpperCase(),
          targetLang: row.targetLanguageCode.toUpperCase(),
        },
      },
      {
        type: 'secondaryText',
        props: {
          type: 'secondary',
          title: row.total || 0,
        },
      },
      {
        type: 'progress',
        props: {
          progress: row.total
            ? row.total > 0
              ? Math.round(((row.mastered ?? 0) / row.total) * 100)
              : 0
            : 0,
        },
      },
      {
        type: 'secondaryText',
        props: {
          type: 'secondary',
          title: row.lastPracticed ? timeAgo(row.lastPracticed) : 'Never',
        },
      },
    ],
  })) satisfies DataTableRowItem[];

export const buildFormFields = (
  dataList: AutoCompleteItem[],
): InputDataItem<CreateListFormValues>[] => [
  {
    schemaKey: 'name',
    id: 'listName',
    label: 'List Name',
    type: 'text',
    placeholder: 'e.g. Kitchen & Cooking',
    autoComplete: 'off',
    icon: 'list',
  },
  {
    schemaKey: 'sourceLanguageCode',
    id: 'sourceLanguageCode',
    label: 'Source Language',
    type: 'autocomplete',
    placeholder: 'Enter the source language',
    autoComplete: 'off',
    icon: 'language',
    dataList,
  },
  {
    schemaKey: 'targetLanguageCode',
    id: 'targetLanguageCode',
    label: 'Target Language',
    type: 'autocomplete',
    placeholder: 'Enter the target language',
    autoComplete: 'off',
    icon: 'language',
    dataList,
  },
];

export const buildVocabListPanelData = (
  data: VocabList[] | undefined,
  clickHandler?: () => void,
): VocabListPanelRowProps[] =>
  (data ?? []).map((row) => ({
    id: row.id,
    sourceLang: row.sourceLanguageCode,
    targetLang: row.targetLanguageCode,
    title: row.name,
    subtitle: `${row.mastered || 0} / ${row.total || 0} mastered · ${row.lastPracticed ? `last ${timeAgo(row.lastPracticed)} ago` : 'Never'}`,
    progress: row.total
      ? Math.round(((row.mastered || 0) / row.total) * 100)
      : 0,
    buttonLabel: 'Practice',
    buttonClickHandler: clickHandler,
  }));

export const modalProps = {
  header: {
    title: 'Create a new list',
  },
  footer: {
    cancelButtonProps: { label: 'Cancel' },
    saveButtonProps: {
      label: 'Create list',
      icon: 'plus',
      rank: 'primary' as const,
      type: 'submit' as const,
      form: FORM_ID,
    },
  },
};

export const buildCreateListFormProps = (
  dataList: AutoCompleteItem[],
  isSubmitting: boolean,
) => ({
  id: FORM_ID,
  schema: createListSchema,
  fields: buildFormFields(dataList),
  submitButtonText: 'Create list',
  isSubmitting,
});

export const buildTableData = (data: VocabList[] | undefined) => ({
  columns: listColumnConfigData,
  rows: buildListTableRows(data),
  isSelectable: true,
  controls: [],
});
