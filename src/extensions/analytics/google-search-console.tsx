import { ReactNode } from 'react';

import { AnalyticsConfigs, AnalyticsProvider } from '.';

export interface GoogleSearchConsoleConfigs extends AnalyticsConfigs {
  verification: string;
}

export class GoogleSearchConsoleProvider implements AnalyticsProvider {
  readonly name = 'google-search-console';

  configs: GoogleSearchConsoleConfigs;

  constructor(configs: GoogleSearchConsoleConfigs) {
    this.configs = configs;
  }

  getMetaTags(): ReactNode {
    return (
      <meta
        name="google-site-verification"
        content={this.configs.verification}
      />
    );
  }
}
