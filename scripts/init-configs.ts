/**
 * Default config initialization script
 *
 * Seeds safe defaults into the config table without overwriting
 * values that were already set in the database.
 *
 * Usage:
 *   npx tsx scripts/init-configs.ts
 */

import { eq } from 'drizzle-orm';

import { envConfigs } from '@/config';
import { db } from '@/core/db';

type SchemaTables = {
  config: any;
};

async function loadSchemaTables(): Promise<SchemaTables> {
  if (envConfigs.database_provider === 'mysql') {
    return (await import('@/config/db/schema.mysql')) as SchemaTables;
  }

  if (['sqlite', 'turso'].includes(envConfigs.database_provider)) {
    return (await import('@/config/db/schema.sqlite')) as SchemaTables;
  }

  return (await import('@/config/db/schema')) as SchemaTables;
}

const defaultConfigs: Record<string, string> = {
  app_name: envConfigs.app_name,
  app_description: envConfigs.app_description,
  app_logo: envConfigs.app_logo,
  app_preview_image: envConfigs.app_preview_image,
  initial_role_enabled: 'true',
  initial_role_name: 'viewer',
  initial_credits_enabled: 'false',
  initial_credits_amount: '0',
  initial_credits_valid_days: '30',
  initial_credits_description: 'Welcome credits for new users',
  email_auth_enabled: 'true',
  email_verification_enabled: 'false',
  google_auth_enabled: 'false',
  google_one_tap_enabled: 'false',
  github_auth_enabled: 'false',
  select_payment_enabled: 'false',
  default_payment_provider: 'stripe',
  stripe_enabled: 'false',
  creem_enabled: 'false',
  paypal_enabled: 'false',
  google_site_verification: '',
  google_analytics_id: '',
  clarity_id: '',
  plausible_domain: '',
  plausible_src: '',
  openpanel_client_id: '',
  vercel_analytics_enabled: 'false',
  affonso_enabled: 'false',
  promotekit_enabled: 'false',
  crisp_enabled: 'false',
  tawk_enabled: 'false',
};

async function initializeConfigs() {
  console.log('Starting default config initialization...\n');

  try {
    const { config } = await loadSchemaTables();
    let created = 0;
    let updatedEmpty = 0;
    let skipped = 0;

    for (const [name, value] of Object.entries(defaultConfigs)) {
      const [existing] = await db()
        .select()
        .from(config)
        .where(eq(config.name, name));

      if (!existing) {
        await db().insert(config).values({ name, value });
        created += 1;
        console.log(`  created: ${name}=${value}`);
        continue;
      }

      const currentValue = String(existing.value ?? '').trim();
      if (!currentValue && value) {
        await db()
          .update(config)
          .set({ value })
          .where(eq(config.name, name));
        updatedEmpty += 1;
        console.log(`  filled empty: ${name}=${value}`);
      } else {
        skipped += 1;
        console.log(`  kept existing: ${name}=${currentValue || '(empty)'}`);
      }
    }

    console.log('\nDefault config initialization completed.');
    console.log(`  created: ${created}`);
    console.log(`  filled empty: ${updatedEmpty}`);
    console.log(`  kept existing: ${skipped}`);
  } catch (error) {
    console.error('\nError during default config initialization:', error);
    process.exit(1);
  }
}

initializeConfigs()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
