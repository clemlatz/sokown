import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Store from '@ember-data/store';

import ENV from 'sokown-client/config/environment';
import type Transition from '@ember/routing/transition';
import type ShipsGetController from 'sokown-client/controllers/ships/get';
import type ShipModel from 'sokown-client/models/ship';

export default class ShipsGetRoute extends Route {
  @service declare store: Store;
  private autoRefresh: number = 0;

  model(params: { id: number }) {
    return this.store.findRecord('ship', params.id);
  }

  afterModel() {
    if (this.autoRefresh === 0 && ENV.environment !== 'test') {
      this.autoRefresh = setInterval(() => this.refresh(), 1000);
    }
  }

  setupController(
    controller: ShipsGetController,
    model: ShipModel,
    transition: Transition,
  ) {
    if (model.destinationPosition) {
      controller.newDestinationPositionX =
        model.destinationPosition.x.toString();
      controller.newDestinationPositionY =
        model.destinationPosition.y.toString();
    }
    super.setupController(controller, model, transition);
  }
}
