import { InputDataItem } from '@/components/ui/Form/Form';
import { VocabListItem } from './types';
import type { DataTableRowItem } from '@/features/app/components/DataTablePanel/DataTable/types';
import { CreateListItemFormValues, createListItemSchema } from './schemas';
import { FieldValues } from 'react-hook-form';
import SoundButton from '@/features/audio/components/SoundButton/SoundButton';

const FORM_ID = 'create-list-item-form';

export const modalProps = {
  header: {
    title: 'Add a new word/phrase',
  },
  footer: {
    cancelButtonProps: { label: 'Cancel' },
    saveButtonProps: {
      label: 'Add word',
      icon: 'plus',
      rank: 'primary' as const,
      type: 'submit' as const,
      form: FORM_ID,
    },
  },
};

export const buildListItemTableRows = (
  listData: VocabListItem[],
  listId: string,
) =>
  listData.map((row) => ({
    id: row.id,
    cells: [
      {
        type: 'primaryText',
        props: {
          type: 'primary',
          title: row.sourceText,
          button: (
            <SoundButton
              listId={listId}
              itemId={row.id}
              size="base"
              className="mr-3"
              field="source"
              title="Play source audio"
            />
          ),
        },
      },
      {
        type: 'secondaryText',
        props: {
          type: 'secondary',
          title: row.targetText,
          button: (
            <SoundButton
              listId={listId}
              itemId={row.id}
              size="base"
              className="mr-3"
              field="target"
              title="Play target audio"
            />
          ),
        },
      },
      {
        type: 'chip',
        props: {
          className: 'w-full',
          label: row.status,
          title: `Status: ${row.status}`,
          icon: row.status === 'MASTERED' ? 'check' : 'notepad-text',
          type: row.status === 'MASTERED' ? 'success' : 'warn',
        },
      },
    ],
  })) satisfies DataTableRowItem[];

interface LanguageNames {
  source?: string;
  target?: string;
}

export const buildFormFields = (
  isEditMode: boolean,
  languageNames: LanguageNames = {},
  itemFormValues: FieldValues,
): InputDataItem<CreateListItemFormValues>[] => [
  {
    schemaKey: 'sourceText',
    id: 'sourceText',
    label: languageNames.source
      ? `Source Text (${languageNames.source})`
      : 'Source Text',
    type: 'text',
    placeholder: 'Enter the source text',
    autoComplete: 'off',
    icon: 'language',
  },
  {
    schemaKey: 'targetText',
    id: 'targetLanguageText',
    label: languageNames.target
      ? `Target Text (${languageNames.target})`
      : 'Target Text',
    type: 'text',
    placeholder: !isEditMode ? 'Translated text' : 'Enter the target text',
    autoComplete: 'off',
    icon: 'language',
    disabled: !isEditMode && !itemFormValues.targetText,
  },
  ...(isEditMode
    ? [
        {
          schemaKey: 'status' as const,
          id: 'mastered',
          label: 'Mark as mastered',
          type: 'checkbox',
        },
      ]
    : []),
];

export const createListItemFormProps = {
  id: FORM_ID,
  schema: createListItemSchema,
  submitButtonText: 'Translate',
  isSubmitButton: false,
  hideSubmitButton: false,
};
