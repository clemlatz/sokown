import Service from '@ember/service';
import { service } from '@ember/service';

export default class CurrentUserService extends Service {
  @service store;
  user = null;

  async load() {
    try {
      this.user = await this.store.findRecord('user', 'me');
    } catch (errorResponse) {
      const error = errorResponse.errors[0];
      if (error.status === 401) {
        this.user = null;
        return;
      }

      throw new Error(error.title);
    }
  }

  get isAuthenticated() {
    return this.user !== null;
  }

  get pilotName() {
    return this.user.pilotName;
  }
}
