import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing } from '@/core/i18n/config';
import { Link } from '@/core/i18n/navigation';
import { getThemePage } from '@/core/theme';
import { getMetadata } from '@/shared/lib/seo';
import { getPostsAndCategories } from '@/shared/models/post';
import {
  Category as CategoryType,
  Post as PostType,
} from '@/shared/types/blocks/blog';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const generateMetadata = getMetadata({
  metadataKey: 'pages.blog.metadata',
  canonicalUrl: '/blog',
});

const practiceTopics = [
  {
    title: 'Find Sa',
    description: 'Set a steady tonic before reading or singing a phrase.',
    href: '/keyboard?practice=find-sa',
  },
  {
    title: 'Daily riyaz',
    description: 'Open the guided warm-up loop and finish a short take.',
    href: '/keyboard?practice=riyaz',
  },
  {
    title: 'Sargam alankar',
    description: 'Practice compact note patterns after checking the map.',
    href: '/keyboard?practice=alankar',
  },
  {
    title: 'Raga phrase',
    description: 'Move from theory into a small beginner raga movement.',
    href: '/keyboard?practice=raga',
  },
  {
    title: 'Bhajan and kirtan',
    description: 'Use the workbench for devotional melody rehearsal.',
    href: '/keyboard?practice=bhajan',
  },
];

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // load blog data
  const t = await getTranslations('pages.blog');

  let posts: PostType[] = [];
  let categories: CategoryType[] = [];

  // current category data
  const currentCategory: CategoryType = {
    id: 'all',
    slug: 'all',
    title: t('messages.all'),
    url: `/blog`,
  };

  try {
    const { posts: allPosts, categories: allCategories } =
      await getPostsAndCategories({
        locale,
        page: 1,
        limit: 30,
      });

    posts = allPosts;
    categories = allCategories;

    categories.unshift(currentCategory);
  } catch (error) {
    console.log('getting posts failed:', error);
  }

  // build page sections
  const page: DynamicPage = {
    title: t('page.title'),
    sections: {
      blog: {
        ...t.raw('page.sections.blog'),
        data: {
          categories,
          currentCategory,
          posts,
        },
      },
    },
  };

  // load page component
  const Page = await getThemePage('dynamic-page');

  return (
    <>
      <section className="border-b border-[#2a1f1a]/10 bg-[#fffdf8] px-4 pt-24 pb-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.22em] text-[#8b2e2e] uppercase">
              Practice from the guide
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold text-[#2a1f1a] sm:text-5xl">
              Web harmonium articles that return to practice
            </h1>
            <p className="mt-4 text-base leading-8 text-[#6b5d52]">
              Read the guide, then jump straight into the matching Indian music
              practice path for Sa, riyaz, alankar, raga, bhajan, or kirtan.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {practiceTopics.map((topic) => (
              <Link
                key={topic.href}
                href={topic.href}
                className="rounded-lg border border-[#2a1f1a]/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c8633a]/45 hover:shadow-md"
              >
                <span className="text-base font-semibold text-[#8b2e2e]">
                  {topic.title}
                </span>
                <span className="mt-2 block text-sm leading-6 text-[#6b5d52]">
                  {topic.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Page locale={locale} page={page} />
    </>
  );
}
