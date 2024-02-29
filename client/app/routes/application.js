import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service currentUser;

  async model() {
    await this.currentUser.load();
  }
}
