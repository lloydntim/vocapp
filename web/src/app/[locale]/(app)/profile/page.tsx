'use client';

import TopBar from '@/features/app/components/TopBar/TopBar';
import Content from '@/features/app/layouts/Content/Content';
import { useCurrentUser, useLogin, useLogout } from '@/features/auth/hooks';
import ProfileCard from '@/features/profile/components/ProfileCard/ProfileCard';
import ProfileDetails from '@/features/profile/components/ProfileDetails/ProfileDetails';
import QueryBoundary from '@/components/ui/QueryBoundary/QueryBoundary';
import SkeletonProfileCard from '@/components/ui/Skeletons/SkeletonProfileCard/SkeletonProfileCard';
import SkeletonProfileDetails from '@/components/ui/Skeletons/SkeletonProfileDetails/SkeletonProfileDetails';
import DeleteModal from '@/features/vocab-lists/components/DeleteModal/DeleteModal';
import FormModal from '@/features/app/components/FormModal/FormModal';
import { InputDataItem } from '@/components/ui/Form/Form';
import { useRef, useState } from 'react';
import {
  useDeleteProfileMutation,
  useUpdateProfileMutation,
} from '@/features/profile/hooks';
import {
  UpdateProfilePayload,
  updateProfilePayloadSchema,
} from '@/features/profile/schemas';
import { User as Profile } from '@/features/auth/schemas';
import Modal from '@/features/app/components/Modal/Modal';

const UPDATE_FORM_ID = 'update-profile-form';

const memberSinceFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
});

function ProfileSection() {
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [profileFormValues, setProfileFormValues] = useState<
    Partial<UpdateProfilePayload>
  >({});
  const { data: user } = useCurrentUser();
  const updateProfileMutation = useUpdateProfileMutation();
  const deleteProfileMutation = useDeleteProfileMutation();
  const logoutMutation = useLogout();

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  const editDialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const logoutDialogRef = useRef<HTMLDialogElement>(null);

  const editProfileHandler = (payload: UpdateProfilePayload) => {
    updateProfileMutation.mutate(payload, {
      onSuccess: () => {
        editDialogRef.current?.close();
        setEditingProfile(null);
      },
    });
  };

  const deleteProfileHandler = () => {
    deleteProfileMutation.mutate(user.id, {
      onSuccess: () => {
        deleteDialogRef.current?.close();
      },
    });
  };

  const logoutHandler = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        logoutDialogRef.current?.close();
      },
    });
  };

  const toFormValues = (profile: Profile | null) => {
    if (!profile) return undefined;
    const { firstName, lastName } = profile;
    return {
      firstName,
      lastName,
    };
  };

  const fields: InputDataItem<UpdateProfilePayload>[] = [
    {
      schemaKey: 'firstName',
      id: 'firstName',
      label: 'First name',
      placeholder: 'Enter first name',
      autoComplete: 'off',
      // icon: 'signature',
    },
    {
      schemaKey: 'lastName',
      id: 'lastName',
      label: 'Last name',
      placeholder: 'Enter last name',
      autoComplete: 'off',
      // icon: 'signature',
    },
  ];

  const formProps = {
    id: UPDATE_FORM_ID,
    schema: updateProfilePayloadSchema,
    fields,
    values: toFormValues(editingProfile),
    hideSubmitButton: true,
    isSubmitting: updateProfileMutation.isPending,
    onValuesChange: setProfileFormValues,
    submitButtonHandler: editProfileHandler,
  };

  const isSaveButtonDisabled =
    !profileFormValues.firstName || !profileFormValues.lastName;

  return (
    <>
      <FormModal
        ref={editDialogRef}
        {...{ formProps }}
        modalProps={{
          header: {
            title: 'Edit profile',
          },
          footer: {
            saveButtonProps: {
              icon: 'square-pen',
              label: 'Edit',
              rank: 'primary' as const,
              type: 'submit' as const,
              disabled: isSaveButtonDisabled,
              loading: updateProfileMutation.isPending,
            },
          },
          onModalClose: () => {
            editDialogRef.current?.close();
            setEditingProfile(null);
          },
        }}
      />
      <Modal
        ref={deleteDialogRef}
        header={{
          title: 'You are about to logout',
          icon: {
            variant: 'warn',
            type: 'log-out',
          },
        }}
        footer={{
          saveButtonProps: {
            label: 'Logout',
            variant: 'warn',
            onClick: () => logoutHandler(),
            loading: logoutMutation.isPending,
          },
        }}
        onModalClose={() => {
          logoutDialogRef.current?.close();
        }}
      >
        Are you sure you want to log out?
      </Modal>

      <DeleteModal
        ref={deleteDialogRef}
        title={`Delete profile of user ${user.username}`}
        message={`This user details of ${user.firstName} ${user.lastName[0]} will be permentantly deleted.`}
        onDelete={deleteProfileHandler}
        isLoading={deleteProfileMutation.isPending}
        onModalClose={() => {
          deleteDialogRef.current?.close();
          setEditingProfile(null);
        }}
      />

      <ProfileCard
        initials={initials}
        name={`${user.firstName} ${user.lastName}`}
        email={user.email}
        isVerified={user.isVerified}
        buttons={[
          {
            label: 'Edit',
            icon: 'pen-line',
            rank: 'secondary',
            onClick: () => editDialogRef.current?.showModal(),
          },
          {
            label: 'Logout',
            icon: 'log-out',
            onClick: () => logoutDialogRef.current?.showModal(),
          },
        ]}
      />
      <ProfileDetails
        cards={[
          {
            title: 'Account',
            rows: [
              {
                label: 'Full name',
                value: `${user.firstName} ${user.lastName}`,
                action: () => editDialogRef.current?.showModal(),
              },
              { label: 'Email', value: user.email },
              {
                label: 'Verification',
                value: user.isVerified ? 'Verified' : 'Unverified',
              },
              {
                label: 'Member since',
                value: memberSinceFormatter.format(new Date(user.createdAt)),
              },
            ],
          },
          {
            title: 'Danger zone',
            className: 'border-t border-(--danger-soft)',
            text: 'Permanently remove your account and all vocabulary data.',
            button: {
              label: 'Delete Account',
              size: 'small',
              variant: 'outline-danger',
              onClick: () => deleteDialogRef.current?.showModal(),
            },
          },
        ]}
      />
    </>
  );
}

function ProfilePage() {
  return (
    <>
      <TopBar path="Account" title="User profile" />
      <Content className="grid gap-6 grid-cols-[280px_1fr]">
        <QueryBoundary
          loadingFallback={
            <>
              <SkeletonProfileCard />
              <SkeletonProfileDetails />
            </>
          }
        >
          <ProfileSection />
        </QueryBoundary>
      </Content>
    </>
  );
}

export default ProfilePage;
