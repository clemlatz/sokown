import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type CurrentUserService from 'sokown-client/services/current-user';

export default class ApplicationRoute extends Route {
  @service declare currentUser: CurrentUserService;

  async model() {
    await this.currentUser.load();
  }
}
