'use client';

import Form from '@/components/ui/Form/Form';
import Link from '@/components/ui/Link/Link';
import Text from '@/components/ui/Text/Text';
import AuthCard from '@/features/auth/components/AuthCard/AuthCard';
import AuthFormColumn from '@/features/auth/components/AuthFormColumn/AuthFormColumn';
import { SignupFormValues, signupSchema } from '@/features/auth/schemas';

const formFields = [
  {
    schemaKey: 'firstName',
    id: 'first-name',
    label: 'First name',
    type: 'text',
    placeholder: 'Kwame',
    autoComplete: 'given-name',
    icon: 'user-round',
  },
  {
    schemaKey: 'lastName',
    id: 'last-name',
    label: 'Last name',
    type: 'text',
    placeholder: 'Asante',
    autoComplete: 'family-name',
    icon: 'signature',
  },
  {
    schemaKey: 'username',
    id: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'yourusername',
    autoComplete: 'username',
    icon: 'at-sign',
  },
  {
    schemaKey: 'email',
    id: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    autoComplete: 'email',
  },
  {
    schemaKey: 'password',
    id: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Create a password',
    autoComplete: 'new-password',
    hint: 'Use 8+ characters with a mix of letters and numbers.',
    showPasswordStrength: true,
  },
  {
    schemaKey: 'terms',
    id: 'terms',
    label: 'I agree to the terms and conditions',
    type: 'checkbox',
  },
];

const authHeaderLinkText = (
  <Text>
    Already have an account? <Link href="/login">Log in</Link>
  </Text>
);

const onSubmit = (data: unknown | SignupFormValues) => {
  console.log('data', data);
};

function page() {
  return (
    <AuthFormColumn authHeaderLink={authHeaderLinkText}>
      <AuthCard
        header={{
          title: 'Create your account',
          subtitle: 'Free to use. Start building vocabulary lists in minutes.',
        }}
        content={
          <Form
            schema={signupSchema}
            fields={formFields}
            submitButtonText="Create account"
            submitButtonHandler={onSubmit}
          />
        }
        hasDivider
        dividerText="or"
        footer={
          <Text>
            Already have an account? <Link href="/login">Log in</Link>
          </Text>
        }
      />
    </AuthFormColumn>
  );
}

export default page;
