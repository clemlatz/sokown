import Component from '@glimmer/component';
import { service } from '@ember/service';

import type CurrentUserService from 'sokown-client/services/current-user';

export default class NavbarComponent extends Component {
  @service declare currentUser: CurrentUserService;

  get isUserAuthenticated() {
    return this.currentUser.isAuthenticated;
  }

  get pilotName() {
    return this.currentUser.pilotName;
  }
}
