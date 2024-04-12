import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Router from '@ember/routing/router';

import type CurrentUserService from 'sokown-client/services/current-user';

export default class HomeRoute extends Route {
  @service declare currentUser: CurrentUserService;
  @service declare router: Router;

  beforeModel() {
    if (this.currentUser.isAuthenticated) {
      this.router.transitionTo('ships');
    }
  }
}
