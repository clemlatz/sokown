import Model, { attr } from '@ember-data/model';

import type { Position } from 'sokown-client/types';

export default class Location extends Model {
  @attr name: string | undefined;
  @attr position: Position | undefined;
}
