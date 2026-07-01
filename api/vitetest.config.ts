import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: [
      'src/features/languages/__tests__/language.service.test.ts',
      'src/features/lists/__tests__/list.service.test.ts',
      'src/features/lists/sessions/__tests__/session.routes.test.ts',
      'src/features/lists/sessions/__tests__/session.service.test.ts',
      'src/features/lists/sessions/results/__tests__/result.routes.test.ts',
      'src/features/lists/sessions/results/__tests__/result.service.test.ts',
    ],
    clearMocks: true,
    restoreMocks: true,
  },
});
