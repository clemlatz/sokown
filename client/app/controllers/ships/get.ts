import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Ship from 'sokown-client/models/ship';

export default class ShipsGetController extends Controller {
  @tracked newDestinationPositionX = '0';
  @tracked newDestinationPositionY = '0';
  declare model: Ship;

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
