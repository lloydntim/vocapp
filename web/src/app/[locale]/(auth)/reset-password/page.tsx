'use client';

import Form, { InputDataItem } from '@/components/ui/Form/Form';
import Link from '@/components/ui/Link/Link';
import AuthCard from '@/features/auth/components/AuthCard/AuthCard';
import AuthFormColumn from '@/features/auth/components/AuthFormColumn/AuthFormColumn';
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from '@/features/auth/schemas';

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

const onSubmit = (data: unknown | ResetPasswordFormValues) => {
  console.log('data', data);
};

function ResetPasswordPage() {
  return (
    <AuthFormColumn authHeaderLink={authHeaderLinkText}>
      <AuthCard
        header={{
          title: 'Set a new password',
          subtitle: "Choose a strong password you haven't used before.",
        }}
        content={
          <Form
            schema={resetPasswordSchema}
            fields={formFields}
            submitButtonText="Reset password"
            submitButtonHandler={onSubmit}
          />
        }
      />
    </AuthFormColumn>
  );
}

export default ResetPasswordPage;
