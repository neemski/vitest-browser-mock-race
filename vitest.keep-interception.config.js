// The same config, plus one no-op context route registered when each page
// opens. Request interception then stays on for the whole session, so
// registering a mock never has to turn it on. With this config the mock
// always applies, which points at the moment interception is turned on.
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const base = playwright();
const provider = {
  ...base,
  providerFactory(project) {
    const instance = base.providerFactory(project);
    const openBrowserPage = instance.openBrowserPage.bind(instance);
    instance.openBrowserPage = async (sessionId, options) => {
      const page = await openBrowserPage(sessionId, options);
      await page.context().route(() => false, () => {});
      return page;
    };
    return instance;
  },
};

export default defineConfig({
  test: {
    include: ['test/**/*.test.js'],
    browser: {
      enabled: true,
      provider,
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
  },
});
