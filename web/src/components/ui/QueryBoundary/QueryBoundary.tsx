'use client';

import { PropsWithChildren, ReactNode, Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import FormBanner from '@/components/ui/Form/FormBanner';
import { getErrorMessage } from '@/lib/client-api';

interface QueryBoundaryProps extends PropsWithChildren {
  loadingFallback: ReactNode;
  className?: string;
}

function QueryBoundary({
  children,
  loadingFallback,
  className,
}: QueryBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }: FallbackProps) => (
            <FormBanner
              message={getErrorMessage(error)}
              status="error"
              className={className}
              showDismissButton
              onDismiss={resetErrorBoundary}
            />
          )}
        >
          <Suspense fallback={loadingFallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

export default QueryBoundary;
