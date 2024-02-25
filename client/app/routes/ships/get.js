import Route from '@ember/routing/route';
import { service } from '@ember/service';

import ENV from 'sokown-client/config/environment';

export default class ShipsGetRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('ship', params.id);
  }

  afterModel() {
    if (!this.autoRefresh && ENV.environment !== 'test') {
      this.autoRefresh = setInterval(() => this.refresh(), 1000);
    }
  }
}
