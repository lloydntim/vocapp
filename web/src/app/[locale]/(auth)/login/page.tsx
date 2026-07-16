'use client';

import Form from '@/components/ui/Form/Form';
import Link from '@/components/ui/Link/Link';
import Text from '@/components/ui/Text/Text';
import AuthCard from '@/features/auth/components/AuthCard/AuthCard';
import AuthFormColumn from '@/features/auth/components/AuthFormColumn/AuthFormColumn';
import { loginSchema, LoginFormValues } from '@/features/auth/schemas';

const authHeaderLinkText = (
  <Text>
    New here? <Link href="/signup">Create an account</Link>
  </Text>
);

const onSubmit = (data: unknown | LoginFormValues) => {
  console.log('data', data);
};

const formFields = [
  {
    schemaKey: 'username',
    id: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'Enter your username',
    autoComplete: 'username',
    icon: 'user',
  },
  {
    schemaKey: 'password',
    id: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    autoComplete: 'current-password',
  },
];

function page() {
  return (
    <AuthFormColumn authHeaderLink={authHeaderLinkText}>
      <AuthCard
        header={{
          title: 'Welcome back',
          subtitle: 'Login to your account to continue.',
        }}
        content={
          <Form
            schema={loginSchema}
            fields={formFields}
            submitButtonText="Login"
            submitButtonHandler={onSubmit}
          />
        }
        hasDivider
        dividerText="or"
        footer={
          <Text>
            Don&apos;t have an account?{' '}
            <Link className="auth-link" href="/signup">
              Sign up free
            </Link>
          </Text>
        }
      />
    </AuthFormColumn>
  );
}

export default page;
