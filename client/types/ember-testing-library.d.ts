declare module '@1024pix/ember-testing-library' {
  export * from '@testing-library/dom/types';

  import { BoundFunctions } from '@testing-library/dom/types';

  export function visit(url: string): Promise<BoundFunctions>;
  export function render(template: string): Promise<BoundFunctions>;
}
