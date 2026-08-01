'use client';

import { useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DataTablePanel from '@/features/app/components/DataTablePanel/DataTablePanel';
import TopBar from '@/features/app/components/TopBar/TopBar';
import Content from '@/features/app/layouts/Content/Content';
import QueryBoundary from '@/components/ui/QueryBoundary/QueryBoundary';
import FormModal from '@/features/app/components/FormModal/FormModal';
import {
  modalProps,
  buildCreateListFormProps,
  buildTableData,
  getLanguageUsage,
} from '@/features/vocab-lists/helpers';
import {
  buildLanguagesDataList,
  buildLanguageNameMap,
  languageFlagMap,
} from '@/features/languages/helpers';
import { useGetLanguages } from '@/features/languages/hooks';
import { useRouter, usePathname } from '@/i18n/navigation';
import {
  useCreateList,
  useDeleteList,
  useListsQuery,
  useUpdateList,
} from '@/features/vocab-lists/hooks';
import {
  CreateListFormValues,
  UpdateListPayload,
} from '@/features/vocab-lists/schemas';
import DeleteModal from '@/features/vocab-lists/components/DeleteModal/DeleteModal';
import { VocabList } from '@/features/vocab-lists/types';
import SkeletonPanel from '@/components/ui/Skeletons/SkeletonPanel/SkeletonPanel';
import { DataTableProps } from '@/features/app/components/DataTablePanel/DataTable/DataTable';

interface PageProps {
  params: { lists: string };
}
function VocabLists({ params }: PageProps) {
  const [editingList, setEditingList] = useState<VocabList | null>(null);
  const [listFormValues, setListFormValues] = useState<
    Partial<CreateListFormValues>
  >({});
  const [selectedListId, setSelectedListId] = useState<string>('');
  const { lists: listsPath } = params;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  const { data: languagesData, isLoading: isLanguagesLoading } =
    useGetLanguages();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeLanguage = searchParams.get('language') ?? '';

  const listsQuery = useListsQuery();
  const lists = listsQuery.data;
  const filteredLists = activeLanguage
    ? lists?.filter((list) => list.targetLanguageCode === activeLanguage)
    : lists;

  const createListMutation = useCreateList();
  const updateListMutation = useUpdateList(selectedListId);
  const deleteListMutation = useDeleteList();

  const languageDataList = buildLanguagesDataList(languagesData?.languages);
  const languageNameMap = buildLanguageNameMap(languagesData?.languages);
  const languageFilterOptions = [
    { value: '', label: 'All languages' },
    ...getLanguageUsage(lists).map(({ languageCode }) => ({
      value: languageCode,
      label: [
        languageFlagMap[languageCode],
        languageNameMap[languageCode] ?? languageCode.toUpperCase(),
      ]
        .filter(Boolean)
        .join(' '),
    })),
  ];

  const handleLanguageFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('language', value);
    } else {
      params.delete('language');
    }
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ''}`);
  };

  const handleEditItem = (id: string) => {
    const list = lists?.find((list) => list.id === id);
    if (list) {
      setEditingList(list);
      setSelectedListId(id);
      dialogRef.current?.showModal();
    }
  };

  const handleDeleteItem = (id: string) => {
    const list = lists?.find((list) => list.id === id);
    if (list) {
      setEditingList(list);
      setSelectedListId(id);
      deleteDialogRef.current?.showModal();
    }
  };

  const tableProps = {
    ...buildTableData(filteredLists),
    controls: [
      {
        icon: 'play',
        title: 'play',
        variant: 'ghost',
        onClick: () => null,
      },
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

  const onSubmit = (data: CreateListFormValues) => {
    if (editingList) return editListHandler(data);
    addListHandler(data);
  };

  const addListHandler = (data: CreateListFormValues) => {
    createListMutation.mutate(data, {
      onSuccess: () => {
        dialogRef.current?.close();
        setEditingList(null);
      },
    });
  };

  const deleteListHandler = () => {
    deleteListMutation.mutate(selectedListId, {
      onSuccess: () => {
        deleteDialogRef.current?.close();
      },
    });
  };

  const editListHandler = (data: UpdateListPayload) => {
    const payload = { name: data.name };
    updateListMutation.mutate(payload, {
      onSuccess: () => {
        dialogRef.current?.close();
        setEditingList(null);
      },
    });
  };

  const toFormValues = (list: VocabList | null) => {
    if (!list) return undefined;

    return {
      sourceLanguageCode: list.sourceLanguageCode,
      targetLanguageCode: list.targetLanguageCode,
      name: list.name,
    };
  };

  const isSaveButtonDisabled =
    !listFormValues.sourceLanguageCode ||
    !listFormValues.targetLanguageCode ||
    !listFormValues.name;

  const formProps = {
    ...buildCreateListFormProps(languageDataList, createListMutation.isPending),
    values: toFormValues(editingList),
    hideSubmitButton: true,
    onValuesChange: setListFormValues,
    submitButtonHandler: onSubmit,
  };

  return (
    <>
      {!isLanguagesLoading && (
        <FormModal
          ref={dialogRef}
          {...{ formProps }}
          modalProps={{
            ...modalProps,
            footer: {
              ...modalProps.footer,
              saveButtonProps: {
                ...modalProps.footer.saveButtonProps,
                icon: editingList
                  ? 'square-pen'
                  : modalProps.footer.saveButtonProps.icon,
                label: editingList
                  ? 'Edit'
                  : modalProps.footer.saveButtonProps.label,
                disabled: isSaveButtonDisabled,
                loading:
                  createListMutation.isPending || updateListMutation.isPending,
              },
            },
            onModalClose: () => dialogRef.current?.close(),
          }}
        />
      )}
      <DeleteModal
        ref={deleteDialogRef}
        title={`Delete ${editingList?.name}`}
        message={`The list ${editingList?.name} will be permentantly removed from the collection.`}
        onDelete={deleteListHandler}
        isLoading={deleteListMutation.isPending}
        onModalClose={() => {
          deleteDialogRef.current?.close();
          setEditingList(null);
          setSelectedListId('');
        }}
      />

      <QueryBoundary className="mb-4" loadingFallback={<SkeletonPanel />}>
        <TopBar path={listsPath} title="Vocabulary Lists" />
        <Content>
          <DataTablePanel
            emptyViewProps={{
              icon: 'book',
              badgeIcon: 'plus',
              title: 'No lists found',
              subtitle: 'Create a new list to get started.',
              buttons: [
                {
                  label: 'New list',
                  icon: 'plus',
                  onClick: () => dialogRef.current?.showModal(),
                },
              ],
            }}
            headerProps={{
              title: 'All lists',
              smallText: `${filteredLists?.length ?? 0} of ${lists?.length ?? 0}`,
              showAddButton: true,
              showSearch: true,
              showLanguageFilter: true,
              addButtonLabel: 'New list',
              searchPlaceholder: 'Search lists',
              toolbar: null,
              searchInputChangeHandler: () => {},
              addButtonClickHandler: () => dialogRef.current?.showModal(),
              languageFilterValue: activeLanguage,
              languageFilterOptions,
              languageFilterClickHandler: handleLanguageFilterChange,
            }}
            tableProps={tableProps}
          />
        </Content>
      </QueryBoundary>
    </>
  );
}

export default VocabLists;
