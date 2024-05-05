import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

import type Location from 'sokown-client/models/location';
import type { Position } from 'sokown-client/types';

export default class LocationGetController extends Controller {
  declare model: Location;
  @tracked targetDate: string = _getCurrentDateAsString();
  @tracked futurePosition: Position | null = null;

  @action
  setTargetDate(event: Event): void {
    this.targetDate = (event.target as HTMLInputElement).value;
  }

  @action
  async calculateFuturePosition(event: Event): Promise<void> {
    event.preventDefault();

    const targetLocationCode = this.model.id;
    const targetTimestamp = new Date(this.targetDate).getTime();

    const response = await fetch(
      `/api/locations/${targetLocationCode}/position?targetDate=${targetTimestamp}`,
    );
    const json = await response.json();
    const { x, y } = json.data.attributes;
    this.futurePosition = { x, y };
  }
}

function _getCurrentDateAsString() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}
