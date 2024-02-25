import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class NavbarComponent extends Component {
  @service currentUser;

  get isUserAuthenticated() {
    return this.currentUser.isAuthenticated;
  }

  get pilotName() {
    return this.currentUser.pilotName;
  }
}
