import { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LocaleDetector } from '@/shared/blocks/common/locale-detector';
import { TopBanner } from '@/shared/blocks/common/top-banner';
import {
  Footer as FooterType,
  Header as HeaderType,
} from '@/shared/types/blocks/landing';
import ThemeLandingLayout from '@/themes/default/layouts/landing';

export default async function LandingLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // load page data
  const t = await getTranslations('landing');

  // header and footer to display
  const header: HeaderType = t.raw('header');
  const footer: FooterType = t.raw('footer');

  return (
    <ThemeLandingLayout header={header} footer={footer}>
      <LocaleDetector />
      {header.topbanner && header.topbanner.text && (
        <TopBanner
          id="topbanner"
          text={header.topbanner?.text}
          buttonText={header.topbanner?.buttonText}
          href={header.topbanner?.href}
          target={header.topbanner?.target}
          closable
          rememberDismiss
          dismissedExpiryDays={header.topbanner?.dismissedExpiryDays ?? 1}
        />
      )}
      {children}
    </ThemeLandingLayout>
  );
}
