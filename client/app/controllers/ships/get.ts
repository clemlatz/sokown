import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

import Ship from 'sokown-client/models/ship';
import type CurrentUserService from 'sokown-client/services/current-user';

export default class ShipsGetController extends Controller {
  @service declare currentUser: CurrentUserService;
  declare model: Ship;
  @tracked newDestinationPositionX = '0';
  @tracked newDestinationPositionY = '0';

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
