'use client';

import { useRouter } from '@/i18n/navigation';
import { useLogin } from '@/features/auth/hooks';

import Form, { InputDataItem } from '@/components/ui/Form/Form';
import Link from '@/components/ui/Link/Link';
import Text from '@/components/ui/Text/Text';
import AuthCard from '@/features/auth/components/AuthCard/AuthCard';
import AuthFormColumn from '@/features/auth/components/AuthFormColumn/AuthFormColumn';
import { loginSchema, LoginFormValues } from '@/features/auth/schemas';
import { ApiError } from '@/lib/client-api';
import FormBanner from '@/components/ui/Form/FormBanner';
import { useState } from 'react';

const authHeaderLinkText = (
  <Text>
    New here? <Link href="/signup">Create an account</Link>
  </Text>
);

const formFields: InputDataItem<LoginFormValues>[] = [
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

function LoginPage() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        setIsRedirecting(true);
        router.push('/dashboard');
        router.refresh();
      },
    });
  };

  const errorMessage =
    loginMutation.error instanceof ApiError
      ? loginMutation.error.message
      : null;

  return (
    <AuthFormColumn authHeaderLink={authHeaderLinkText}>
      <AuthCard
        header={{
          title: 'Welcome back',
          subtitle: 'Login to your account to continue.',
        }}
        content={
          <>
            {errorMessage && (
              <FormBanner
                message={errorMessage}
                status="error"
                className="mb-4"
              />
            )}
            <Form
              schema={loginSchema}
              fields={formFields}
              submitButtonText="Login"
              submitButtonHandler={onSubmit}
              isSubmitting={loginMutation.isPending || isRedirecting}
            />
          </>
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

export default LoginPage;
