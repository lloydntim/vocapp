'use client';
import FormBanner from '@/components/ui/Form/FormBanner';
import Link from '@/components/ui/Link/Link';
import AuthCard from '@/features/auth/components/AuthCard/AuthCard';
import AuthFormColumn from '@/features/auth/components/AuthFormColumn/AuthFormColumn';
import { useVerify } from '@/features/auth/hooks';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useEffect, useRef } from 'react';
import Spinner from '@/components/ui/Spinner/Spinner';

function VerifyConfirmPage() {
  const token = useSearchParams().get('token');
  const router = useRouter();
  const verifyMutation = useVerify();
  const { mutate: verify } = verifyMutation;

  const hasFired = useRef(false);

  useEffect(() => {
    if (!token || hasFired.current) return;

    hasFired.current = true;
    verify(
      { token },
      {
        onSuccess: () => {
          router.push('/dashboard');
          router.refresh();
        },
        onError: (error) => {
          console.error('Verification failed:', error);
        },
      },
    );
  }, [token, verify, router]);

  if (!token || verifyMutation.isError) {
    return (
      <AuthFormColumn
        authHeaderLink={<Link href="/login">Back to log in</Link>}
      >
        <AuthCard
          header={{
            title: 'Verification Failed',
            subtitle: 'Invalid or expired verification token.',
          }}
          content={
            <FormBanner
              status="error"
              title="Verification Failed"
              message="This link is invalid or has expired. Try signing up again, or ask for a new link."
            />
          }
        />
      </AuthFormColumn>
    );
  }

  return (
    <AuthFormColumn>
      <AuthCard
        header={{ title: 'Verifying your account...' }}
        content={<Spinner size="large" className="mx-auto" />}
      />
    </AuthFormColumn>
  );
}

export default VerifyConfirmPage;
