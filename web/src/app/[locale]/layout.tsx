import { routing } from '@/i18n/routing';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/dist/client/components/navigation';
import { PropsWithChildren } from 'react';

interface LocaleLayoutProps extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

async function Layout({ children, params }: Readonly<LocaleLayoutProps>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
}

export default Layout;
