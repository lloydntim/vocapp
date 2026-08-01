'use client';

import TopBar from '@/features/app/components/TopBar/TopBar';

import Content from '@/features/app/layouts/Content/Content';
import VocabListPanel from '@/features/dashboard/VocabListPanel/VocabListPanel';
import { useRef } from 'react';
import { buildLanguagesDataList } from '@/features/languages/helpers';
import {
  modalProps,
  buildCreateListFormProps,
  buildVocabListPanelData,
} from '@/features/vocab-lists/helpers';
import FormModal from '@/features/app/components/FormModal/FormModal';
import { useGetLanguages } from '@/features/languages/hooks';
import { useCreateList, useGetLists } from '@/features/vocab-lists/hooks';
import { CreateListFormValues } from '@/features/vocab-lists/schemas';
import QueryBoundary from '@/components/ui/QueryBoundary/QueryBoundary';
import SkeletonPanel from '@/components/ui/Skeletons/SkeletonPanel/SkeletonPanel';

interface VocabListSectionProps {
  onCreateListClick: () => void;
}

function VocabListSection({ onCreateListClick }: VocabListSectionProps) {
  const getListsQuery = useGetLists();
  const listData = buildVocabListPanelData(getListsQuery.data);

  return (
    <VocabListPanel
      data={listData}
      title="Resume practice"
      buttonLinkLabel="All lists"
      emptyViewProps={{
        title: 'No lists yet',
        subtitle: 'Create your first vocabulary list to start practicing.',
        buttons: [
          {
            label: 'Create list',
            icon: 'plus',
            onClick: onCreateListClick,
          },
        ],
      }}
    />
  );
}

function DashBoardPage() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { data: languagesData, isLoading: isLanguagesLoading } =
    useGetLanguages();
  const createListMutation = useCreateList();

  const languageDataList = buildLanguagesDataList(languagesData?.languages);

  const onSubmit = (data: CreateListFormValues) => {
    createListMutation.mutate(data, {
      onSuccess: () => dialogRef.current?.close(),
    });
  };

  const formProps = {
    ...buildCreateListFormProps(languageDataList, createListMutation.isPending),
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
            onModalClose: () => dialogRef.current?.close(),
          }}
        />
      )}
      <TopBar path="Dashboard" title="Overview" />
      <Content>
        <QueryBoundary className="mb-4" loadingFallback={<SkeletonPanel />}>
          <VocabListSection
            onCreateListClick={() => dialogRef.current?.showModal()}
          />
        </QueryBoundary>
      </Content>
    </>
  );
}

export default DashBoardPage;
