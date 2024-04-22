import Model, { attr } from '@ember-data/model';

import type User from './user';
import type Location from './location';
import type { Position } from 'sokown-client/types';

export default class ShipModel extends Model {
  @attr declare owner: User;
  @attr declare name: string;
  @attr declare speedInKilometersPerSecond: number;
  @attr declare currentPosition: Position;
  @attr declare currentLocation: Location;
  @attr declare destinationPosition: Position;
  @attr declare destinationLocation: Location;
  @attr declare timeToDestination: number | null;

  get isStationary() {
    return this.destinationPosition === null;
  }
}
