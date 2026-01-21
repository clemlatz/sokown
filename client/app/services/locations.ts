import Service, { service } from '@ember/service';
import type Store from '@ember-data/store';

import type Location from 'sokown-client/models/location';

// noinspection JSUnusedGlobalSymbols
export default class LocationsService extends Service {
  @service declare store: Store;
  @tracked locations: Location[] = [];
  private locationSource: EventSource | null = null;

  async load(): Promise<void> {
    this.locations = (await this.store.findAll(
      'location',
    )) as unknown as Location[];

    this.subscribe();
  }

  getAll(): Location[] {
    return this.locations;
  }

  subscribe(): void {
    if (this.locationSource !== null) {
      this.unsubscribe();
    }

    this.locationSource = new EventSource('/api/locations/live');

    this.locationSource.addEventListener('message', (event) => {
      const payload = JSON.parse(event.data);
      this.store.push({ data: payload });
    });
  }

  private unsubscribe() {
    this.locationSource?.close();
    this.locationSource = null;
  }

  willDestroy() {
    super.willDestroy();
    this.unsubscribe();
  }
}

declare module '@ember/service' {
  interface Registry {
    locations: LocationsService;
  }
}
