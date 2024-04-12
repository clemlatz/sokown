import Controller from '@ember/controller';
import type Store from '@ember-data/store';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

import type UserModel from 'sokown-client/models/user';
import type CurrentUserService from 'sokown-client/services/current-user';

export default class UserSignupController extends Controller {
  @service declare store: Store;
  @service declare currentUser: CurrentUserService;

  @tracked pilotName: string = '';
  @tracked shipName: string = '';
  @tracked notificationsAreEnabled: boolean = false;

  @tracked registrationSuccessful = false;
  @tracked registrationError: string | null = null;

  @action
  async register(event: Event) {
    event.preventDefault();

    const user = (await this.store.createRecord('user', {
      pilotName: this.pilotName,
      shipName: this.shipName,
      hasEnabledNotifications: this.notificationsAreEnabled,
    })) as UserModel;

    try {
      this.registrationError = null;
      await user.save();
      this.registrationSuccessful = true;
    } catch (error) {
      this.registrationError = 'An error occurred!';
    }
  }
}
