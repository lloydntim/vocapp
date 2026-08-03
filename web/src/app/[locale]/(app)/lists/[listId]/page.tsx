'use client';

import DataTablePanel from '@/features/app/components/DataTablePanel/DataTablePanel';
import TopBar from '@/features/app/components/TopBar/TopBar';
import Content from '@/features/app/layouts/Content/Content';
import {
  buildFormFields,
  buildListItemTableRows,
  createListItemFormProps,
  modalProps,
} from '@/features/vocab-items/helpers';
import { ContentHeader } from '@/features/app/layouts/Content/ContentHeader';
import LangBadges from '@/features/app/components/Badges/LangBadges';
import Button from '@/components/ui/Button/Button';
import { itemColumnConfigData } from '@/features/vocab-items/columns';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';
import OverlayLoader from '@/components/ui/OverlayLoader/OverlayLoader';
import VocabListSummaryBar from '@/features/vocab-lists/components/VocabListSummaryBar/VocabListSummaryBar';
import FormModal from '@/features/app/components/FormModal/FormModal';
import { useGetList, useListQuery } from '@/features/vocab-lists/hooks';
import {
  useGetLanguages,
  useGetTranslations,
} from '@/features/languages/hooks';
import { buildLanguageNameMap } from '@/features/languages/helpers';
import {
  useCreateListItem,
  useDeleteListItem,
  useGetListItems,
  useUpdateListItem,
} from '@/features/vocab-items/hooks';
import {
  CreateListItemFormValues,
  CreateListItemPayload,
} from '@/features/vocab-items/schemas';
import { UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { useMemo, useRef, useState } from 'react';
import { FormHandle } from '@/components/ui/Form/Form';
import { DataTableProps } from '@/features/app/components/DataTablePanel/DataTable/DataTable';
import SkeletonContentHeader from '@/components/ui/Skeletons/SkeletonContentHeader/SkeletonContentHeader';
import SkeletonVocabListSummaryBar from '@/components/ui/Skeletons/SkeletonVocabListSummaryBar/SkeletonVocabListSummaryBar';
import SkeletonPanel from '@/components/ui/Skeletons/SkeletonPanel/SkeletonPanel';
import { VocabListItem } from '@/features/vocab-items/types';
import QueryBoundary from '@/components/ui/QueryBoundary/QueryBoundary';
import DeleteModal from '@/features/vocab-lists/components/DeleteModal/DeleteModal';

function ListSummarySection({ listId }: { listId: string }) {
  const listQuery = useGetList(listId);
  const list = listQuery.data;

  return (
    <>
      <ContentHeader
        eyebrow={
          <LangBadges
            sourceLang={list.sourceLanguageCode.toUpperCase()}
            targetLang={list.targetLanguageCode.toUpperCase()}
          />
        }
        title={list.name}
        backLink="/lists"
      >
        <Button
          icon="play"
          title="Practice"
          isLink
          to={`/lists/${listId}/practice`}
          target="_self"
        >
          Practice
        </Button>
      </ContentHeader>
      <VocabListSummaryBar
        total={list.total ?? 0}
        mastered={list.mastered ?? 0}
        lastPracticed={list.lastPracticed || ''}
        progress={list.progress ?? 0}
      />
    </>
  );
}

interface ListItemsSectionProps {
  listId: string;
  onEditButtonClick: (item: VocabListItem) => void;
  onDeleteButtonClick: (item: VocabListItem) => void;
  onAddButtonClick: () => void;
}

const statusFilterOptions = [
  { value: '', label: 'All' },
  { value: 'LEARNING', label: 'Learning' },
  { value: 'MASTERED', label: 'Mastered' },
];

function ListItemsSection({
  listId,
  onEditButtonClick,
  onDeleteButtonClick,
  onAddButtonClick,
}: ListItemsSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeStatus = searchParams.get('status') ?? '';

  const listItemQuery = useGetListItems(listId);
  const listItems = listItemQuery.data;
  const filteredItems = activeStatus
    ? listItems.filter((item) => item.status === activeStatus)
    : listItems;

  const handleStatusFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('status', value);
    } else {
      params.delete('status');
    }
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ''}`);
  };

  const handleEditItem = (id: string) => {
    const item = listItems.find((listItem) => listItem.id === id);
    if (item) onEditButtonClick(item);
  };

  const handleDeleteItem = (id: string) => {
    const item = listItems.find((listItem) => listItem.id === id);
    if (item) onDeleteButtonClick(item);
  };

  const tableProps = {
    columns: itemColumnConfigData,
    rows: buildListItemTableRows(filteredItems, listId),
    isSelectable: false,
    controls: [
      {
        icon: 'square-pen',
        title: 'Edit',
        variant: 'ghost',
        onClick: handleEditItem,
      },
      {
        icon: 'trash-2',
        title: 'Delete',
        variant: 'ghost-danger',
        onClick: handleDeleteItem,
      },
    ],
  } satisfies DataTableProps;

  return (
    <DataTablePanel
      emptyViewProps={{
        icon: 'book',
        badgeIcon: 'plus',
        title: 'No words found',
        subtitle: 'Add a new phrase/word to get started.',
        buttons: [
          {
            label: 'Add phrase/word',
            icon: 'plus',
            onClick: onAddButtonClick,
          },
        ],
      }}
      headerProps={{
        title: 'All words',
        smallText: `${filteredItems.length} of ${listItems.length}`,
        showAddButton: true,
        showSearch: true,
        showLanguageFilter: false,
        showStatusFilter: true,
        addButtonLabel: 'New word/phrase',
        searchPlaceholder: 'Search words',
        searchInputChangeHandler: () => {},
        addButtonClickHandler: onAddButtonClick,
        statusFilterValue: activeStatus,
        statusFilterOptions,
        statusFilterClickHandler: handleStatusFilterChange,
      }}
      tableProps={tableProps}
    />
  );
}

function VocabListPage() {
  const [editingItem, setEditingItem] = useState<VocabListItem | null>(null);
  const { listId } = useParams<{ listId: string }>();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<FormHandle<CreateListItemFormValues>>(null);
  const [itemFormValues, setItemFormValues] = useState<
    Partial<CreateListItemFormValues>
  >({});
  // The sourceText a translation (or, in edit mode, the saved item itself)
  // was produced for. When it stops matching the live sourceText, the
  // footer button falls back to "Translate" instead of "Save" so a stale
  // targetText can't be saved silently.
  const [syncedSourceText, setSyncedSourceText] = useState<string | null>(
    null,
  );

  const translationMutation = useGetTranslations();
  const createItemMutation = useCreateListItem(listId);
  const updateItemMutation = useUpdateListItem(listId, editingItem?.id || '');
  const deleteItemMutation = useDeleteListItem(listId);

  const listQuery = useListQuery(listId);
  const list = listQuery.data;

  const languagesQuery = useGetLanguages();
  const languageNameMap = useMemo(
    () => buildLanguageNameMap(languagesQuery.data?.languages),
    [languagesQuery.data],
  );

  const languageNames = {
    source: list && languageNameMap[list.sourceLanguageCode],
    target: list && languageNameMap[list.targetLanguageCode],
  };

  const onTranslate = ({
    setValue,
    getValues,
  }: {
    setValue: UseFormSetValue<CreateListItemFormValues>;
    getValues: UseFormGetValues<CreateListItemFormValues>;
  }) => {
    const sourceText = getValues('sourceText');
    if (!sourceText || !list) return;

    translationMutation.mutate(
      {
        sourceLanguageCode: list.sourceLanguageCode,
        targetLanguageCode: list.targetLanguageCode,
        sourceText,
      },
      {
        onSuccess: ({ data: { translatedText } }) => {
          setValue('targetText', translatedText);
          setSyncedSourceText(sourceText);
        },
      },
    );
  };

  const onSubmit = (data: CreateListItemPayload) => {
    if (editingItem) return editItemHandler(data);
    addItemHandler(data);
  };

  const handleIconClick = (item: VocabListItem) => {
    setEditingItem(item);
    setSyncedSourceText(item.sourceText);
    dialogRef.current?.showModal();
  };
  const handleDeleteIconClick = (item: VocabListItem) => {
    setEditingItem(item);
    deleteDialogRef.current?.showModal();
  };

  const closeItemModal = () => {
    dialogRef.current?.close();
    setEditingItem(null);
    setItemFormValues({});
    setSyncedSourceText(null);
  };

  const addItemHandler = (data: CreateListItemPayload) => {
    createItemMutation.mutate(data, {
      onSuccess: closeItemModal,
    });
  };

  const deleteItemHandler = () => {
    deleteItemMutation.mutate(editingItem?.id || '', {
      onSuccess: () => {
        console.log('deleted');
        deleteDialogRef.current?.close();
      },
    });
  };

  const editItemHandler = (data: CreateListItemPayload) => {
    const payload = { status: data.status };
    updateItemMutation.mutate(payload, {
      onSuccess: closeItemModal,
    });
  };

  const toFormValues = (item: VocabListItem | null) => {
    if (!item) return undefined;

    return {
      sourceText: item.sourceText,
      targetText: item.targetText,
      status: item.status === 'MASTERED',
    };
  };

  const formProps = {
    ...createListItemFormProps,
    fields: buildFormFields(!!editingItem, languageNames, itemFormValues),
    values: toFormValues(editingItem),
    onValuesChange: setItemFormValues,
    submitButtonHandler: onSubmit,
  };

  // Stays "Translate" until targetText was produced for the sourceText
  // currently in the field — see the syncedSourceText comment above.
  const needsTranslation =
    !itemFormValues.targetText ||
    itemFormValues.sourceText !== syncedSourceText;

  const saveButtonProps = needsTranslation
    ? {
        label: 'Translate',
        icon: 'language',
        rank: 'primary' as const,
        type: 'button' as const,
        disabled: !itemFormValues.sourceText || translationMutation.isPending,
        loading: translationMutation.isPending,
        onClick: () => {
          if (!formRef.current) return;
          onTranslate({
            setValue: formRef.current.setValue,
            getValues: formRef.current.getValues,
          });
        },
      }
    : {
        ...modalProps.footer.saveButtonProps,
        icon: editingItem ? 'square-pen' : modalProps.footer.saveButtonProps.icon,
        label: editingItem ? 'Edit' : modalProps.footer.saveButtonProps.label,
        loading: createItemMutation.isPending || updateItemMutation.isPending,
      };

  return (
    <>
      {translationMutation.isPending && <OverlayLoader />}

      <FormModal
        ref={dialogRef}
        formRef={formRef}
        {...{ formProps }}
        modalProps={{
          ...modalProps,
          header: {
            title: editingItem ? 'Edit word/phrase' : modalProps.header.title,
          },
          footer: {
            ...modalProps.footer,
            saveButtonProps,
          },
          onModalClose: closeItemModal,
        }}
      />
      <DeleteModal
        objectId={list?.id}
        ref={deleteDialogRef}
        title={`Delete ${editingItem?.sourceText}`}
        message={`The word/phrase with translation ${editingItem?.targetText} will be permentantly removed from the list.`}
        onDelete={deleteItemHandler}
        isLoading={deleteItemMutation.isPending}
        onModalClose={() => {
          deleteDialogRef.current?.close();
          setEditingItem(null);
        }}
      />

      <TopBar path="list" title="Vocabulary List" />
      <Content>
        <QueryBoundary
          className="mb-4"
          loadingFallback={
            <>
              <SkeletonContentHeader />
              <SkeletonVocabListSummaryBar />
            </>
          }
        >
          <ListSummarySection listId={listId} />
        </QueryBoundary>

        <QueryBoundary className="mb-4" loadingFallback={<SkeletonPanel />}>
          <ListItemsSection
            listId={listId}
            onEditButtonClick={handleIconClick}
            onDeleteButtonClick={handleDeleteIconClick}
            onAddButtonClick={() => dialogRef.current?.showModal()}
          />
        </QueryBoundary>
      </Content>
    </>
  );
}

export default VocabListPage;
