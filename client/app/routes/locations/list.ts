import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Store from '@ember-data/store';

import type LocationsService from 'sokown-client/services/locations';

export default class LocationsRoute extends Route {
  @service declare store: Store;
  @service declare locations: LocationsService;

  async model() {
    return this.locations.getAll();
  }
}
