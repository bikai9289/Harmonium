import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { localeMessagesPaths } from '@/config/locale';
import { routing } from '@/core/i18n/config';
import { loadMessages } from '@/core/i18n/request';
import { ThemeProvider } from '@/core/theme/provider';
import { Toaster } from '@/shared/components/ui/sonner';
import { AppContextProvider } from '@/shared/contexts/app';
import { getMetadata } from '@/shared/lib/seo';

export const generateMetadata = getMetadata();

async function getLocaleMessages(locale: string) {
  const allMessages = await Promise.all(
    localeMessagesPaths.map((path) => loadMessages(path, locale))
  );

  const messages: Record<string, any> = {};

  localeMessagesPaths.forEach((path, index) => {
    const keys = path.split('/');
    let current = messages;

    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] ??= {};
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = allMessages[index];
  });

  return messages;
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getLocaleMessages(locale);

  return (
    <NextIntlClientProvider
      formats={{}}
      locale={locale}
      messages={messages}
      now={new Date(0)}
      timeZone="UTC"
    >
      <ThemeProvider>
        <AppContextProvider>
          {children}
          <Toaster position="top-center" richColors />
        </AppContextProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
