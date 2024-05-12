import Service, { service } from '@ember/service';
import type Store from '@ember-data/store';

import type Location from 'sokown-client/models/location';

// noinspection JSUnusedGlobalSymbols
export default class LocationsService extends Service {
  @service declare store: Store;
  locations: Location[] = [];

  async load(): Promise<void> {
    this.locations = (await this.store.findAll(
      'location',
    )) as unknown as Location[];
  }

  getAll(): Location[] {
    return this.locations;
  }
}

declare module '@ember/service' {
  interface Registry {
    locations: LocationsService;
  }
}
