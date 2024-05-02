import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Nastavení paralelismu
  workers: 4, // Počet paralelních instancí
  expect: {
    timeout: 30000 // Nastavení timeoutu pro expect na 30 sekund
  },
  fullyParallel: true,
  use: {
    video: {
      mode: 'off',
      size: { width: 1600, height: 900 },
    }
  }
});

