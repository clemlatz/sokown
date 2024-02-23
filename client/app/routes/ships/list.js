import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ShipsRoute extends Route {
  @service store;

  async model() {
    return this.store.findAll('ship');
  }

  @action
  async refreshModel() {
    return this.refresh();
  }
}
