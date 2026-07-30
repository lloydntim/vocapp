'use client';

import Form, { InputDataItem } from '@/components/ui/Form/Form';
import FormBanner from '@/components/ui/Form/FormBanner';
import Link from '@/components/ui/Link/Link';
import Text from '@/components/ui/Text/Text';
import AuthCard from '@/features/auth/components/AuthCard/AuthCard';
import AuthFormColumn from '@/features/auth/components/AuthFormColumn/AuthFormColumn';
import { useForgotPassword } from '@/features/auth/hooks';
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from '@/features/auth/schemas';
import { getErrorMessage } from '@/lib/client-api';

const authHeaderLinkText = <Link href="/login">Back to log in</Link>;

const formFields: InputDataItem<ForgotPasswordFormValues>[] = [
  {
    schemaKey: 'email',
    id: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    autoComplete: 'email',
  },
];

function ForgotPasswordPage() {
  const forgotPasswordMutation = useForgotPassword();

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(data);
  };

  if (forgotPasswordMutation.isSuccess) {
    return (
      <AuthFormColumn authHeaderLink={authHeaderLinkText}>
        <AuthCard
          header={{
            title: 'Check your email',
            subtitle: "We've sent a link to reset your password.",
          }}
          content={
            <FormBanner
              status="success"
              message="The link expires in 15 minutes."
              showDismissButton={false}
            />
          }
          footer={
            <Text>
              Didn&apos;t get it? <Link href="/login">Back to log in</Link>
            </Text>
          }
        />
      </AuthFormColumn>
    );
  }

  return (
    <AuthFormColumn authHeaderLink={authHeaderLinkText}>
      <AuthCard
        header={{
          title: 'Reset your password',
          subtitle:
            "Enter the email on your account and we'll send a link to reset your password.",
        }}
        content={
          <>
            {forgotPasswordMutation.isError && (
              <FormBanner
                status="error"
                message={getErrorMessage(forgotPasswordMutation.error)}
                className="mb-4"
              />
            )}
            <Form
              schema={forgotPasswordSchema}
              fields={formFields}
              submitButtonText="Send reset link"
              submitButtonHandler={onSubmit}
              isSubmitting={forgotPasswordMutation.isPending}
            />
          </>
        }
        hasDivider
        dividerText="or"
        footer={
          <Text>
            Remembered it? <Link href="/login">Log in</Link>
          </Text>
        }
      />
    </AuthFormColumn>
  );
}

export default ForgotPasswordPage;
