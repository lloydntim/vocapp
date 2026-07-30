'use client';

import { useSearchParams } from 'next/navigation';
import Form, { InputDataItem } from '@/components/ui/Form/Form';
import FormBanner from '@/components/ui/Form/FormBanner';
import Link from '@/components/ui/Link/Link';
import AuthCard from '@/features/auth/components/AuthCard/AuthCard';
import AuthFormColumn from '@/features/auth/components/AuthFormColumn/AuthFormColumn';
import { useRouter } from '@/i18n/navigation';
import { useResetPassword } from '@/features/auth/hooks';
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from '@/features/auth/schemas';
import { getErrorMessage } from '@/lib/client-api';

const authHeaderLinkText = <Link href="/login">Back to log in</Link>;

const formFields: InputDataItem<ResetPasswordFormValues>[] = [
  {
    schemaKey: 'password',
    id: 'password',
    label: 'New password',
    type: 'password',
    placeholder: 'Enter your new password',
    autoComplete: 'new-password',
    showPasswordStrength: true,
  },
  {
    schemaKey: 'confirmPassword',
    id: 'confirmPassword',
    label: 'Confirm new password',
    type: 'password',
    placeholder: 'Re-enter your new password',
    autoComplete: 'new-password',
    showPasswordStrength: true,
  },
];

function ResetPasswordPage() {
  const token = useSearchParams().get('token');
  const router = useRouter();
  const resetPasswordMutation = useResetPassword();

  const onSubmit = (data: ResetPasswordFormValues) => {
    if (!token) return;

    resetPasswordMutation.mutate(
      { token, password: data.password },
      {
        onSuccess: () => {
          router.push('/login');
        },
      },
    );
  };

  if (!token) {
    return (
      <AuthFormColumn authHeaderLink={authHeaderLinkText}>
        <AuthCard
          header={{
            title: 'Invalid reset link',
            subtitle: 'This link is missing its reset token.',
          }}
          content={
            <FormBanner
              status="error"
              message="Request a new password reset link and try again."
              showDismissButton={false}
            />
          }
        />
      </AuthFormColumn>
    );
  }

  return (
    <AuthFormColumn authHeaderLink={authHeaderLinkText}>
      <AuthCard
        header={{
          title: 'Set a new password',
          subtitle: "Choose a strong password you haven't used before.",
        }}
        content={
          <>
            {resetPasswordMutation.isError && (
              <FormBanner
                status="error"
                message={getErrorMessage(resetPasswordMutation.error)}
                className="mb-4"
              />
            )}
            <Form
              schema={resetPasswordSchema}
              fields={formFields}
              submitButtonText="Reset password"
              submitButtonHandler={onSubmit}
              isSubmitting={resetPasswordMutation.isPending}
            />
          </>
        }
      />
    </AuthFormColumn>
  );
}

export default ResetPasswordPage;
