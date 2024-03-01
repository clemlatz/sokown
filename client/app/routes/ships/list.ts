import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';
import type Store from '@ember-data/store';

import ENV from 'sokown-client/config/environment';

export default class ShipsRoute extends Route {
  @service declare store: Store;
  private autoRefresh: number = 0;

  async model() {
    return this.store.findAll('ship');
  }

  @action
  async refreshModel() {
    return this.refresh();
  }

  afterModel() {
    if (this.autoRefresh === 0 && ENV.environment !== 'test') {
      this.autoRefresh = setInterval(() => this.refresh(), 1000);
    }
  }
}
