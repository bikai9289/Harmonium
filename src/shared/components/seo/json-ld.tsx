type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

export function JsonLd({ data }: { data: JsonLdValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

export function absoluteUrl(baseUrl: string, pathOrUrl?: string) {
  const normalizedBase = baseUrl.replace(/\/$/, '');

  if (!pathOrUrl) {
    return normalizedBase;
  }

  if (/^https?:\/\//.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return `${normalizedBase}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export function createBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createFaqJsonLd(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
