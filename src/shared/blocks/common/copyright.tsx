'use client';

import { useEffect, useState } from 'react';

import { envConfigs } from '@/config';
import { Brand as BrandType } from '@/shared/types/blocks/common';

export function Copyright({ brand }: { brand: BrandType }) {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className={`text-muted-foreground text-sm`}>
      © {currentYear || 2024}{' '}
      <a
        href={brand?.url || envConfigs.app_url}
        target={brand?.target || ''}
        className="inline-flex min-h-10 items-center rounded-md px-1 align-middle font-medium text-[#e8c39e] transition hover:text-white"
      >
        {brand?.title || envConfigs.app_name}
      </a>
      , All rights reserved
    </div>
  );
}
