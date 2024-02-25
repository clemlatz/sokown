import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

import ENV from 'sokown-client/config/environment';

export default class ShipsRoute extends Route {
  @service store;

  async model() {
    return this.store.findAll('ship');
  }

  @action
  async refreshModel() {
    return this.refresh();
  }

  afterModel() {
    if (!this.autoRefresh && ENV.environment !== 'test') {
      this.autoRefresh = setInterval(() => this.refresh(), 1000);
    }
  }
}
