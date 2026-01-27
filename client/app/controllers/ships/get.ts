import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

import Ship from 'sokown-client/models/ship';
import type CurrentUserService from 'sokown-client/services/current-user';
import type LocationsService from 'sokown-client/services/locations';
import type Location from 'sokown-client/models/location';

export default class ShipsGetController extends Controller {
  @service declare currentUser: CurrentUserService;
  @service declare locations: LocationsService;

  declare model: Ship;
  @tracked newDestinationPositionX = '';
  @tracked newDestinationPositionY = '';

  get starMapLocations(): Location[] {
    return this.locations.getAll();
  }

  @action
  updateDestinationPositionX(event: { target: HTMLInputElement }) {
    this.newDestinationPositionX = event.target.value;
  }

  @action
  updateDestinationPositionY(event: { target: HTMLInputElement }) {
    this.newDestinationPositionY = event.target.value;
  }

  @action
  async setDestination(event: Event) {
    event.preventDefault();
    this.model.destinationPosition = {
      x: parseFloat(this.newDestinationPositionX),
      y: parseFloat(this.newDestinationPositionY),
    };
    await this.model.save();
  }
}
