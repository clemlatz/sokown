import Model, { attr } from '@ember-data/model';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type User from './user';
import type Location from './location';
import type { Position } from 'sokown-client/types';

dayjs.extend(relativeTime);

export default class ShipModel extends Model {
  @attr declare owner: User;
  @attr declare name: string;
  @attr declare speedInKilometersPerSecond: number;
  @attr declare currentPosition: Position;
  @attr declare currentLocation: Location;
  @attr declare currentCourse: number;
  @attr declare destinationPosition: Position;
  @attr declare destinationLocation: Location;
  @attr declare timeToDestination: number | null;

  get isStationary() {
    return this.destinationPosition === null;
  }

  get timeOfArrival(): string | null {
    if (this.timeToDestination === null) {
      return null;
    }

    const timeOfArrival = this._getTimeOfArrival(this.timeToDestination);
    return timeOfArrival.toLocaleString();
  }

  get relativeTimeOfArrival(): string | null {
    if (this.timeToDestination === null) {
      return null;
    }

    const timeOfArrival = this._getTimeOfArrival(this.timeToDestination);
    return dayjs().to(dayjs(timeOfArrival), true);
  }

  private _getTimeOfArrival(timeToDestination: number) {
    const nowInSeconds = Math.round(Date.now() / 1000);
    const timeOfArrivalInSeconds = nowInSeconds + timeToDestination;
    return new Date(timeOfArrivalInSeconds * 1000);
  }
}
