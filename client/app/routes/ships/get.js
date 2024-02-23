import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ShipsGetRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('ship', params.id);
  }
}
