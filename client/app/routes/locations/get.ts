import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Store from '@ember-data/store';

export default class LocationGetRoute extends Route {
  @service declare store: Store;

  model(params: { id: number }) {
    return this.store.findRecord('location', params.id);
  }
}
