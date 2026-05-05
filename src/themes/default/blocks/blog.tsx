import {
  ArrowRight,
  Calendar,
  Clock,
  Headphones,
  Mic2,
  Music2,
  Piano,
  Sparkles,
  Waves,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import {
  Category as CategoryType,
  Post as PostType,
} from '@/shared/types/blocks/blog';
import { Section } from '@/shared/types/blocks/landing';

const BLOG_FILTERS = [
  { slug: 'all', title: 'All', href: '/blog' },
  { slug: 'beginner', title: 'Beginner', href: '/blog?topic=beginner' },
  { slug: 'sargam', title: 'Sargam', href: '/blog?topic=sargam' },
  { slug: 'midi', title: 'MIDI', href: '/blog?topic=midi' },
  { slug: 'vocal', title: 'Vocal', href: '/blog?topic=vocal' },
  { slug: 'raga', title: 'Raga', href: '/blog?topic=raga' },
] as const;

const COVER_STYLES = [
  'from-[#f7d9b7] via-[#faf7f2] to-[#c8633a]',
  'from-[#e8dfd2] via-[#fffdf8] to-[#8b4a2e]',
  'from-[#d8e2d2] via-[#faf7f2] to-[#6f7f57]',
  'from-[#efd1c6] via-[#fffaf4] to-[#9d4f38]',
  'from-[#d5dbe8] via-[#faf7f2] to-[#596a91]',
  'from-[#f0dfaa] via-[#fffaf0] to-[#a36a2e]',
] as const;

function getPostTheme(post: PostType) {
  const text =
    `${post.slug ?? ''} ${post.title ?? ''} ${(post.tags ?? []).join(' ')}`.toLowerCase();

  if (text.includes('midi'))
    return {
      category: 'MIDI',
      title: 'MIDI',
      subtitle: 'Connect keys',
      Icon: Headphones,
    };
  if (text.includes('vocal') || text.includes('warm'))
    return {
      category: 'Vocal',
      title: 'VOCAL',
      subtitle: 'Warm-up tones',
      Icon: Mic2,
    };
  if (text.includes('sargam') || text.includes('note'))
    return {
      category: 'Sargam',
      title: 'SARGAM',
      subtitle: 'Sa Re Ga Ma',
      Icon: Music2,
    };
  if (text.includes('raga') || text.includes('tonic') || text.includes('sa'))
    return {
      category: 'Raga',
      title: 'RAGA',
      subtitle: 'Find your Sa',
      Icon: Waves,
    };
  if (text.includes('bhajan') || text.includes('kirtan'))
    return {
      category: 'Beginner',
      title: 'BHAJAN',
      subtitle: 'Kirtan flow',
      Icon: Sparkles,
    };
  return {
    category: 'Beginner',
    title: 'BEGINNER',
    subtitle: 'Start playing',
    Icon: Piano,
  };
}

function getReadTime(post: PostType) {
  const fixedReadTimes: Record<string, number> = {
    'how-to-play-harmonium-online-for-free': 6,
    'harmonium-keyboard-notes-for-beginners': 7,
    'find-your-tonic-sa-on-web-harmonium': 5,
    'sargam-notes-on-web-harmonium-complete-guide': 8,
    'using-midi-keyboard-with-web-harmonium': 6,
    'vocal-warm-up-exercises-with-web-harmonium': 5,
    'play-bhajan-kirtan-on-web-harmonium': 6,
    'web-harmonium-vs-real-harmonium': 7,
  };
  const fixed = post.slug ? fixedReadTimes[post.slug] : undefined;

  if (fixed) {
    return `${fixed} min read`;
  }

  const words =
    `${post.title ?? ''} ${post.description ?? ''} ${post.content ?? ''}`
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

  return `${Math.max(3, Math.ceil(words / 180))} min read`;
}

export function Blog({
  section,
  className,
  categories,
  currentCategory,
  posts,
}: {
  section: Section;
  className?: string;
  categories: CategoryType[];
  currentCategory: CategoryType;
  posts: PostType[];
}) {
  const t = useTranslations('pages.blog.messages');

  return (
    <section
      id={section.id}
      className={cn(
        'bg-[#faf7f2] py-20 text-[#2a1f1a] md:py-28',
        section.className,
        className
      )}
    >
      <div className="mx-auto mb-12 text-center">
        {section.sr_only_title && (
          <h1 className="sr-only">{section.sr_only_title}</h1>
        )}
        <h2 className="mb-6 text-3xl font-semibold text-pretty lg:text-4xl">
          {section.title}
        </h2>
        <p className="mx-auto mb-4 max-w-3xl text-[#6f6258] lg:text-lg">
          {section.description}
        </p>
      </div>

      <div className="container flex flex-col items-center gap-8 lg:px-16">
        <div className="mb-1 flex w-full max-w-4xl flex-wrap items-center justify-center gap-2">
          {BLOG_FILTERS.map((filter) => {
            const active =
              filter.slug === 'all'
                ? !currentCategory?.slug || currentCategory.slug === 'all'
                : currentCategory?.slug === filter.slug;

            return (
              <Link
                key={filter.slug}
                href={filter.href}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition',
                  active
                    ? 'border-[#8b4a2e] bg-[#8b4a2e] text-white shadow-sm'
                    : 'border-[#e8dfd2] bg-white text-[#6f6258] hover:border-[#c8633a]/50 hover:text-[#8b2e2e]'
                )}
              >
                {filter.title}
              </Link>
            );
          })}
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid w-full gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts?.map((item, idx) => {
              const theme = getPostTheme(item);
              const readTime = getReadTime(item);
              const CoverIcon = theme.Icon;

              return (
                <Link
                  key={idx}
                  href={item.url || ''}
                  target={item.target || '_self'}
                  className="group h-full"
                >
                  <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#e8dfd2] bg-white shadow-[0_18px_48px_rgba(74,52,35,0.08)] transition group-hover:-translate-y-1 group-hover:border-[#d8c8b8] group-hover:shadow-[0_24px_60px_rgba(74,52,35,0.12)]">
                    <div
                      className={cn(
                        'relative aspect-[16/9] overflow-hidden bg-gradient-to-br',
                        COVER_STYLES[idx % COVER_STYLES.length]
                      )}
                    >
                      <div className="absolute inset-x-6 top-6 flex items-center justify-between text-xs font-semibold tracking-[0.18em] text-[#2a1f1a]/60 uppercase">
                        <span>Web Harmonium</span>
                        <span>{String(idx + 1).padStart(2, '0')}</span>
                      </div>
                      <div className="absolute top-14 left-6 flex items-start gap-3">
                        <span className="flex size-10 items-center justify-center rounded-full bg-white/78 text-[#8b2e2e] shadow-sm">
                          <CoverIcon className="size-5" />
                        </span>
                        <div>
                          <p className="text-2xl font-semibold tracking-[0.08em] text-[#2a1f1a]">
                            {theme.title}
                          </p>
                          <p className="mt-1 text-sm font-medium text-[#6f6258]">
                            {theme.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="absolute right-6 bottom-5 left-6">
                        <div className="mb-4 h-2 rounded-full bg-[#2a1f1a]/18">
                          <div className="h-full w-2/3 rounded-full bg-[#8b2e2e]" />
                        </div>
                        <div className="grid grid-cols-7 gap-1.5">
                          {Array.from({ length: 14 }).map((_, keyIndex) => (
                            <span
                              key={keyIndex}
                              className={cn(
                                'h-8 rounded-b-md shadow-sm',
                                keyIndex % 5 === 1 || keyIndex % 5 === 3
                                  ? 'bg-[#2a1f1a]'
                                  : 'bg-white/88'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#fff0e5] px-3 py-1 text-xs font-semibold tracking-[0.14em] text-[#8b2e2e] uppercase">
                          {theme.category}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#faf7f2] px-3 py-1 text-xs font-medium text-[#6f6258]">
                          <Clock className="size-3.5" />
                          {readTime}
                        </span>
                      </div>

                      <h3 className="mb-3 text-lg leading-snug font-semibold text-[#2a1f1a] md:text-xl">
                        {item.title}
                      </h3>
                      <p className="mb-5 line-clamp-3 text-sm leading-7 text-[#6f6258]">
                        {item.description}
                      </p>

                      <div className="mt-auto flex items-center gap-3 text-xs text-[#7a6b60]">
                        {item.created_at && (
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4" />
                            {item.created_at}
                          </div>
                        )}
                        <span className="ml-auto inline-flex items-center gap-1 font-semibold text-[#8b2e2e]">
                          Read
                          <ArrowRight className="size-3.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-md py-8 text-[#6f6258]">{t('no_content')}</div>
        )}
      </div>
    </section>
  );
}
