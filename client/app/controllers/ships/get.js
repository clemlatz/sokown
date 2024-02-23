import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ShipsGetController extends Controller {
  @tracked newDestinationPositionX = 0;
  @tracked newDestinationPositionY = 0;

  @action
  setDestination(event) {
    event.preventDefault();
    this.model.destinationPosition = {
      x: parseFloat(this.newDestinationPositionX),
      y: parseFloat(this.newDestinationPositionY),
    };
    this.model.save();
  }
}
