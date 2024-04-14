import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Store from '@ember-data/store';

export default class LocationsRoute extends Route {
  @service declare store: Store;

  async model() {
    return this.store.findAll('location');
  }
}
