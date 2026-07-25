'use client';

import { PropsWithChildren } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import FormBanner from '@/components/ui/Form/FormBanner';
import { getErrorMessage } from '@/lib/client-api';

const fallbackWrapperClass = 'flex items-center justify-center min-h-screen p-8';

function AuthErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className={fallbackWrapperClass}>
      <FormBanner
        title="Couldn't load your account"
        message={getErrorMessage(error)}
        status="error"
        showDismissButton
        onDismiss={resetErrorBoundary}
      />
    </div>
  );
}

function AuthErrorBoundary({ children }: PropsWithChildren) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={AuthErrorFallback}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

export default AuthErrorBoundary;
