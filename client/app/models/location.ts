import Model, { attr } from '@ember-data/model';

import type { Position } from 'sokown-client/types';

export default class Location extends Model {
  @attr declare name: string;
  @attr declare position: Position;
  @attr declare primaryBodyPosition: Position | null;
  @attr declare distanceFromPrimaryBody: number;
}
