import { module, test } from 'qunit';
import sinon from 'sinon';

import { setupTest } from 'sokown-client/tests/helpers';
import type UserSignupRoute from 'sokown-client/routes/user/signup';

module('Unit | Route | user/signup', function (hooks) {
  setupTest(hooks);

  module('model', function () {
    test('it queries current authentification method', async function (assert) {
      // given
      const route = this.owner.lookup('route:user/signup') as UserSignupRoute;
      const store = this.owner.lookup('service:store');
      const authenticationMethod = Symbol();
      const storeStub = sinon
        .stub(store, 'findRecord')
        .resolves(authenticationMethod);

      // when
      const model = await route.model();

      // then
      assert.strictEqual(model, authenticationMethod);
      assert.ok(storeStub.calledWith('authentication-method', 'current'));
    });
  });
});
