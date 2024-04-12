import Route from '@ember/routing/route';
import type Store from '@ember-data/store';
import { service } from '@ember/service';
import AuthenticationMethodModel from 'sokown-client/models/authentication-method';
import type UserSignupController from 'sokown-client/controllers/user/signup';
import type Transition from '@ember/routing/transition';

export default class UserSignupRoute extends Route {
  @service declare store: Store;

  model() {
    return this.store.findRecord('authentication-method', 'current');
  }

  setupController(
    controller: UserSignupController,
    model: AuthenticationMethodModel,
    transition: Transition,
  ) {
    controller.pilotName = model.idTokenClaims.username;
    controller.shipName = controller.pilotName
      ? `${controller.pilotName}'s ship`
      : '';
    super.setupController(controller, model, transition);
  }
}
