'use client';

import Form, { InputDataItem } from '@/components/ui/Form/Form';
import Link from '@/components/ui/Link/Link';
import Text from '@/components/ui/Text/Text';
import AuthCard from '@/features/auth/components/AuthCard/AuthCard';
import AuthFormColumn from '@/features/auth/components/AuthFormColumn/AuthFormColumn';
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from '@/features/auth/schemas';

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
const onSubmit = (data: ForgotPasswordFormValues) => {
  console.log('data', data);
};

function page() {
  return (
    <AuthFormColumn authHeaderLink={authHeaderLinkText}>
      <AuthCard
        header={{
          title: 'Reset your password',
          subtitle:
            "Enter the email on your account and we'll send a link to reset your password.",
        }}
        content={
          <Form
            schema={forgotPasswordSchema}
            fields={formFields}
            submitButtonText="Send reset link"
            submitButtonHandler={onSubmit}
          />
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

export default page;
