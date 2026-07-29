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
import { useParams } from 'next/navigation';
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

function ListItemsSection({
  listId,
  onEditButtonClick,
  onDeleteButtonClick,
  onAddButtonClick,
}: ListItemsSectionProps) {
  const listItemQuery = useGetListItems(listId);
  const listItems = listItemQuery.data;

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
    rows: buildListItemTableRows(listItems),
    isSelectable: true,
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
        title: 'All lists',
        smallText: '10 of 10',
        showAddButton: true,
        showSearch: true,
        showLanguageFilter: true,
        addButtonLabel: 'New word/phrase',
        searchPlaceholder: 'Search lists',
        searchInputChangeHandler: () => {},
        addButtonClickHandler: onAddButtonClick,
        languageFilterClickHandler: () => {},
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
  const [itemFormValues, setItemFormValues] = useState<
    Partial<CreateListItemFormValues>
  >({});

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
    dialogRef.current?.showModal();
  };
  const handleDeleteIconClick = (item: VocabListItem) => {
    setEditingItem(item);
    deleteDialogRef.current?.showModal();
  };

  const addItemHandler = (data: CreateListItemPayload) => {
    createItemMutation.mutate(data, {
      onSuccess: () => {
        dialogRef.current?.close();
        setEditingItem(null);
      },
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
      onSuccess: () => {
        dialogRef.current?.close();
        setEditingItem(null);
      },
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
    hideSubmitButton: !!editingItem,
    isSubmitting: translationMutation.isPending,
    onValuesChange: setItemFormValues,
    submitButtonHandler: onSubmit,
    submitButtonClickHandler: onTranslate,
  };

  const isSaveButtonDisabled =
    !itemFormValues.sourceText || !itemFormValues.targetText;

  return (
    <>
      {translationMutation.isPending && <OverlayLoader />}

      <FormModal
        ref={dialogRef}
        {...{ formProps }}
        modalProps={{
          ...modalProps,
          header: {
            title: editingItem ? 'Edit word/phrase' : modalProps.header.title,
          },
          footer: {
            ...modalProps.footer,
            saveButtonProps: {
              ...modalProps.footer.saveButtonProps,
              icon: editingItem
                ? 'square-pen'
                : modalProps.footer.saveButtonProps.icon,
              label: editingItem
                ? 'Edit'
                : modalProps.footer.saveButtonProps.label,
              disabled: isSaveButtonDisabled,
              loading:
                createItemMutation.isPending || updateItemMutation.isPending,
            },
          },
          onModalClose: () => {
            dialogRef.current?.close();
            setEditingItem(null);
          },
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
