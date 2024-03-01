import Service from '@ember/service';
import { service } from '@ember/service';
import Store from '@ember-data/store';

import User from 'sokown-client/models/user';

type ErrorResponse = {
  errors: [
    {
      status: number;
      title: string;
    },
  ];
};

export default class CurrentUserService extends Service {
  @service declare store: Store;
  user: User | null = null;

  async load() {
    try {
      this.user = (await this.store.findRecord('user', 'me')) as User;
    } catch (errorResponse: unknown) {
      const error = (errorResponse as ErrorResponse).errors[0];
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
    return this.user?.pilotName;
  }
}
