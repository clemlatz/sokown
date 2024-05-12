import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type CurrentUserService from 'sokown-client/services/current-user';
import type LocationsService from 'sokown-client/services/locations';

export default class ApplicationRoute extends Route {
  @service declare locations: LocationsService;
  @service declare currentUser: CurrentUserService;

  async model() {
    await this.locations.load();
    await this.currentUser.load();
  }
}
