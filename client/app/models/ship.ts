import Model, { attr } from '@ember-data/model';
import User from './user';

type Position = {
  x: number;
  y: number;
};

type Location = {
  name: string;
};

export default class ShipModel extends Model {
  @attr declare owner: User;
  @attr name: string | undefined;
  @attr speedInKilometersPerSecond: number | undefined;
  @attr currentPosition: Position | undefined;
  @attr currentLocation: Location | undefined;
  @attr destinationPosition: Position | undefined;
  @attr destinationLocation: Location | undefined;

  get isStationary() {
    return this.destinationPosition === null;
  }
}
