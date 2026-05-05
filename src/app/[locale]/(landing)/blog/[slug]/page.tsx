import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { envConfigs } from '@/config';
import {
  absoluteUrl,
  createBreadcrumbJsonLd,
  JsonLd,
} from '@/shared/components/seo/json-ld';
import { getPost } from '@/shared/models/post';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('pages.blog.metadata');

  const canonicalUrl =
    locale !== envConfigs.locale
      ? `${envConfigs.app_url}/${locale}/blog/${slug}`
      : `${envConfigs.app_url}/blog/${slug}`;

  const post = await getPost({ slug, locale });
  if (!post) {
    notFound();
  }

  return {
    title: `${post.title} | ${t('title')}`,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPost({ slug, locale });

  if (!post) {
    notFound();
  }

  const postUrl = absoluteUrl(
    envConfigs.app_url,
    locale !== envConfigs.locale ? `/${locale}/blog/${slug}` : `/blog/${slug}`
  );
  const blogUrl = absoluteUrl(
    envConfigs.app_url,
    locale !== envConfigs.locale ? `/${locale}/blog` : '/blog'
  );
  const homeUrl = absoluteUrl(
    envConfigs.app_url,
    locale !== envConfigs.locale ? `/${locale}` : '/'
  );
  const imageUrl = absoluteUrl(
    envConfigs.app_url,
    post.image || envConfigs.app_preview_image
  );
  const authorImageUrl = post.author_image
    ? absoluteUrl(envConfigs.app_url, post.author_image)
    : undefined;
  const postTitle = post.title || slug;
  const postDescription =
    post.description || 'Play Harmonium guide for browser-based harmonium practice.';
  const publishedDate = post.date || post.created_at || undefined;

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: postTitle,
    description: postDescription,
    image: imageUrl,
    url: postUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    ...(publishedDate
      ? {
          datePublished: publishedDate,
          dateModified: publishedDate,
        }
      : {}),
    inLanguage: locale,
    author: {
      '@type': 'Organization',
      name: post.author_name || 'Play Harmonium Team',
      ...(authorImageUrl ? { image: authorImageUrl } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Play Harmonium',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(envConfigs.app_url, envConfigs.app_logo),
      },
    },
  };

  // build page sections
  const page: DynamicPage = {
    sections: {
      blogDetail: {
        block: 'blog-detail',
        data: {
          post,
        },
      },
    },
  };

  const Page = await getThemePage('dynamic-page');

  return (
    <>
      <JsonLd data={blogPostingJsonLd} />
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: 'Play Harmonium', url: homeUrl },
          { name: 'Blog', url: blogUrl },
          { name: postTitle, url: postUrl },
        ])}
      />
      <Page locale={locale} page={page} />
    </>
  );
}
