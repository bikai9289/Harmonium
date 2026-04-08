import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { getMetadata } from '@/shared/lib/seo';
import { getCurrentSubscription } from '@/shared/models/subscription';
import { getUserInfo } from '@/shared/models/user';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'pages.pricing.metadata',
  canonicalUrl: '/pricing',
});

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('pages.pricing');
  const user = await getUserInfo();
  const currentSubscription = user
    ? await getCurrentSubscription(user.id)
    : undefined;

  const page: DynamicPage = {
    title: t.raw('page.title'),
    sections: {
      pricing: {
        ...t.raw('page.sections.pricing'),
      },
    },
  };

  const Page = await getThemePage('dynamic-page');

  return (
    <Page
      locale={locale}
      page={page}
      data={{
        currentSubscription,
      }}
    />
  );
}
