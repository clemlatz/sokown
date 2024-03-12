import { module, test } from 'qunit';
import sinon from 'sinon';

import { setupTest } from 'sokown-client/tests/helpers';
import type UserSignupController from 'sokown-client/controllers/user/signup';

module('Unit | Controller | user/signup', function (hooks) {
  setupTest(hooks);

  module('register', function () {
    test('it creates a new user', async function (assert) {
      // given
      const controller = this.owner.lookup(
        'controller:user/signup',
      ) as UserSignupController;
      controller.set('pilotName', 'pilotName');
      controller.set('shipName', 'shipName');
      controller.set('notificationsAreEnabled', true);

      const store = this.owner.lookup('service:store');
      const userStub = { save: sinon.stub().resolves() };
      const createRecordStub = sinon
        .stub(store, 'createRecord')
        .resolves(userStub);
      const event = new Event('submit');

      // when
      await controller.register(event);

      // then
      assert.ok(
        createRecordStub.calledWith('user', {
          pilotName: 'pilotName',
          shipName: 'shipName',
          hasEnabledNotifications: true,
        }),
      );
      assert.ok(userStub.save.calledOnce);
    });
  });
});
