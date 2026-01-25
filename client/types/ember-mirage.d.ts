declare module 'ember-mirage/test-support' {
  export function setupMirage(
    hooks: NestedHooks,
    options: {
      createServer?: (config?: Record<string, unknown>) => unknown;
      config?: Record<string, unknown>;
    },
  ): void;
}
