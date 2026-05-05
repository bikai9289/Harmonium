'use client';

import { TOCItems, TOCProvider } from 'fumadocs-ui/components/layout/toc';
import { CalendarIcon, ListIcon, Play } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { MarkdownPreview } from '@/shared/blocks/common';
import { Crumb } from '@/shared/blocks/common/crumb';
import { NOTE_KEYS, type NoteKey } from '@/shared/blocks/harmonium/constants';
import { useHarmoniumPlayer } from '@/shared/blocks/harmonium/use-harmonium-player';
import { cn } from '@/shared/lib/utils';
import { type Post as PostType } from '@/shared/types/blocks/blog';
import { NavItem } from '@/shared/types/blocks/common';

import '@/config/style/docs.css';

export function BlogDetail({ post }: { post: PostType }) {
  const t = useTranslations('pages.blog.messages');

  const crumbItems: NavItem[] = [
    {
      title: t('crumb'),
      url: '/blog',
      icon: 'Newspaper',
      is_active: false,
    },
    {
      title: post.title || '',
      url: `/blog/${post.slug}`,
      is_active: true,
    },
  ];

  // Check if TOC should be shown
  const showToc = post.toc && post.toc.length > 0;

  // Check if Author info should be shown
  const showAuthor = post.author_name || post.author_image || post.author_role;
  const { activeNoteIds, startNote, stopNote } = useHarmoniumPlayer({
    octave: 4,
    transpose: 0,
    volume: 0.32,
    reverbEnabled: false,
    reedMode: 'single',
  });

  // Calculate main content column span based on what sidebars are shown
  const getMainColSpan = () => {
    if (showToc) return 'lg:col-span-6';
    return 'lg:col-span-9';
  };

  const playPreviewNote = async (note: NoteKey) => {
    await startNote(note);
    window.setTimeout(() => stopNote(note.id), 520);
  };

  return (
    <TOCProvider toc={post.toc || []}>
      <section id={post.id} className="bg-[#faf7f2] text-[#2a1f1a]">
        <div className="py-24 md:py-32">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
            <Crumb items={crumbItems} />

            {/* Header Section */}
            <div className="mt-16 text-center">
              <h1 className="mx-auto mb-4 w-full text-3xl font-bold text-[#2a1f1a] md:max-w-4xl md:text-4xl">
                {post.title}
              </h1>
              <div className="text-md mb-8 flex flex-wrap items-center justify-center gap-4 text-[#6f6258]">
                {post.created_at && (
                  <div className="flex items-center justify-center gap-2">
                    <CalendarIcon className="size-4" /> {post.created_at}
                  </div>
                )}
                {showAuthor && (
                  <span>
                    {post.author_name}
                    {post.author_role ? ` · ${post.author_role}` : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-8 md:mt-12 lg:grid-cols-12">
              {/* Table of Contents - Left Sidebar */}
              {showToc && (
                <div className="lg:col-span-3">
                  <div className="sticky top-24 hidden md:block">
                    <div className="rounded-lg border border-[#e8dfd2] bg-white/78 p-4 shadow-sm">
                      <h2 className="mb-4 flex items-center gap-2 font-semibold text-[#2a1f1a]">
                        <ListIcon className="size-4" /> {t('toc')}
                      </h2>
                      <div className="blog-toc text-[#6f6258]">
                        <TOCItems />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Content - Center */}
              <div className={getMainColSpan()}>
                <article className="p-0">
                  {post.body ? (
                    <div className="docs text-md space-y-4 font-normal text-[#2a1f1a] *:leading-relaxed">
                      {post.body}
                    </div>
                  ) : (
                    post.content && (
                      <div className="prose prose-lg max-w-none space-y-6 text-[#2a1f1a] *:leading-relaxed">
                        <MarkdownPreview content={post.content} />
                      </div>
                    )
                  )}
                </article>
              </div>

              <div className="lg:col-span-3">
                <div className="sticky top-24 space-y-4">
                  <MiniPracticeKeyboard
                    activeNoteIds={activeNoteIds}
                    onPlay={(note) => {
                      void playPreviewNote(note);
                    }}
                  />
                  <div className="rounded-lg border border-[#e8dfd2] bg-white/78 p-4 shadow-sm">
                    <p className="text-sm font-semibold text-[#2a1f1a]">
                      Quick Sargam notes
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4'].map(
                        (noteId) => {
                          const note = NOTE_KEYS.find(
                            (item) => item.id === noteId
                          );
                          if (!note) return null;

                          return (
                            <button
                              key={note.id}
                              type="button"
                              onClick={() => {
                                void playPreviewNote(note);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-full border border-[#8b2e2e]/15 bg-[#fff8ef] px-3 py-1.5 text-sm font-medium text-[#8b2e2e] transition hover:bg-[#fff0e5]"
                            >
                              <Play className="size-3.5" />
                              {note.sargam}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </TOCProvider>
  );
}

function MiniPracticeKeyboard({
  activeNoteIds,
  onPlay,
}: {
  activeNoteIds: string[];
  onPlay: (note: NoteKey) => void;
}) {
  const previewNotes = NOTE_KEYS.filter((note) =>
    ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4'].includes(note.id)
  );

  return (
    <div className="rounded-lg border border-[#e8dfd2] bg-white/82 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#2a1f1a]">
            Listen while reading
          </p>
          <p className="mt-1 text-sm leading-6 text-[#6f6258]">
            Tap a note to hear the Sargam reference tone.
          </p>
        </div>
        <span className="rounded-full bg-[#8b2e2e]/10 px-2.5 py-1 text-xs font-semibold text-[#8b2e2e]">
          Play
        </span>
      </div>

      <div className="mt-4 rounded-[1rem] bg-[#8b4a2e] p-1.5 shadow-inner">
        <div className="relative h-32 overflow-hidden rounded-[0.8rem] bg-[#1f1b17] px-1.5 pt-1.5 pb-2">
          {previewNotes.map((note, index) => {
            const isActive = activeNoteIds.includes(note.id);
            const width = 100 / previewNotes.length;

            return (
              <button
                key={note.id}
                type="button"
                onClick={() => onPlay(note)}
                className={cn(
                  'absolute top-1.5 bottom-2 flex flex-col justify-end rounded-b-md border-r border-[#2a1f1a]/25 px-1 pb-2 text-center transition',
                  isActive
                    ? 'translate-y-1 bg-[#f0c28f]'
                    : 'bg-[linear-gradient(180deg,#fffef9_0%,#f3e7d8_100%)]'
                )}
                style={{
                  left: `calc(${index * width}% + 0.375rem)`,
                  width: `calc(${width}% - 0.375rem)`,
                }}
              >
                <span className="text-xs font-bold text-[#8b2e2e]">
                  {note.sargam}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
