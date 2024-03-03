import Controller from '@ember/controller';
import type Store from '@ember-data/store';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class UserSignupController extends Controller {
  @service declare store: Store;

  @tracked pilotName: string = '';
  @tracked shipName: string = '';
  @tracked notificationsAreEnabled: boolean = false;
}
