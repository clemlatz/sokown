declare module '@1024pix/ember-testing-library' {
  import type { TemplateFactory } from 'ember-cli-htmlbars';
  export * from '@testing-library/dom/types';

  import { BoundFunctions } from '@testing-library/dom/types';

  export function visit(url: string): Promise<BoundFunctions>;
  export function render(template: TemplateFactory): Promise<BoundFunctions>;
}
