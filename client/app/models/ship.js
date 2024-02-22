import Model, { attr } from '@ember-data/model';

export default class ShipModel extends Model {
  @attr name;
  @attr currentPosition;
  @attr currentLocation;
  @attr destinationPosition;
  @attr destinationLocation;

  get isStationary() {
    return this.destinationPosition === null;
  }
}
