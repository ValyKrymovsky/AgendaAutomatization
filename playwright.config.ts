import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  // Nastavení paralelismu
  workers: 4, // Počet paralelních instancí
  expect: {
    timeout: 30000 // Nastavení timeoutu pro expect na 30 sekund
  },
  fullyParallel: true,
  use: {
    video: {
      mode: 'retain-on-failure',
      size: { width: 1600, height: 900 },
    }
  }
};

export default config;

