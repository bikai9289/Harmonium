import { NextResponse } from 'next/server';

import { getAllConfigs } from '@/shared/models/config';

function formatAdsTxt(publisherId?: string | null) {
  if (!publisherId) {
    return '';
  }

  const normalizedPublisherId = publisherId.trim().replace(/^ca-/, '');

  if (!normalizedPublisherId) {
    return '';
  }

  return `google.com, ${normalizedPublisherId}, DIRECT, f08c47fec0942fa0`;
}

export async function GET() {
  try {
    const envAdsContent = formatAdsTxt(process.env.ADSENSE_PUBLISHER_ID);

    if (envAdsContent) {
      return new NextResponse(envAdsContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    const configs = await getAllConfigs();
    const adsContent = formatAdsTxt(configs.adsense_code);

    return new NextResponse(adsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('get ads.txt failed:', error);
    return new NextResponse('', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
