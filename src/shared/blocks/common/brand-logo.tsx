import Image from 'next/image';

import { Link } from '@/core/i18n/navigation';
import { Brand as BrandType } from '@/shared/types/blocks/common';

export function BrandLogo({ brand }: { brand: BrandType }) {
  const logoSrc = brand.logo?.src || '';
  const shouldBypassOptimizer =
    logoSrc.startsWith('/') || logoSrc.startsWith('http');

  return (
    <Link
      href={brand.url || ''}
      target={brand.target || '_self'}
      className={`flex items-center space-x-3 ${brand.className}`}
    >
      {brand.logo && (
        <Image
          src={logoSrc}
          alt={brand.logo.alt || brand.title || 'Logo'}
          width={brand.logo.width || 80}
          height={brand.logo.height || 80}
          className="h-8 w-auto rounded-lg"
          unoptimized={shouldBypassOptimizer}
        />
      )}
      {brand.title && (
        <span className="text-lg font-medium">{brand.title}</span>
      )}
    </Link>
  );
}
