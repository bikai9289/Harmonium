import { getThemeBlock } from '@/core/theme';
import type { DynamicPage as DynamicPageType } from '@/shared/types/blocks/landing';

// 定义 promp 主题下允许显示的 sections
const ALLOWED_SECTIONS = ['hero', 'faq', 'cta','features'];

export default async function DynamicPage({
  locale,
  page,
  data,
}: {
  locale?: string;
  page: DynamicPageType;
  data?: Record<string, any>;
}) {
  return (
    <>
      {page.title && !page.sections?.hero && (
        <h1 className="sr-only">{page.title}</h1>
      )}
      {page?.sections &&
        Object.keys(page.sections).map(async (sectionKey: string) => {
          const section = page.sections?.[sectionKey];
          if (!section || section.disabled === true) {
            return null;
          }

          // promp 主题：强制只显示 ALLOWED_SECTIONS 中定义的区块
          if (!ALLOWED_SECTIONS.includes(sectionKey)) {
            return null;
          }

          // block name
          const block = section.block || section.id || sectionKey;

          switch (block) {
            default:
              try {
                if (section.component) {
                  return section.component;
                }

                const DynamicBlock = await getThemeBlock(block);
                return (
                  <DynamicBlock
                    key={sectionKey}
                    section={section}
                    {...(data || section.data || {})}
                  />
                );
              } catch (error) {
                return null;
              }
          }
        })}
    </>
  );
}
