import { module, test } from 'qunit';
import { setupTest } from 'sokown-client/tests/helpers';
import sinon from 'sinon';

module('Unit | Service | currentUser', function (hooks) {
  setupTest(hooks);

  module('load', function () {
    test('it loads current user if authentified', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      sinon.stub(store, 'findRecord');
      store.findRecord.resolves({
        pilotName: 'Erich Hartmann',
      });
      const service = this.owner.lookup('service:current-user');

      // when
      await service.load();

      // then
      assert.deepEqual(service.user, {
        pilotName: 'Erich Hartmann',
      });
    });

    test('it handles 401 error', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      sinon.stub(store, 'findRecord');
      store.findRecord.rejects({
        errors: [{ status: 401 }],
      });
      const service = this.owner.lookup('service:current-user');

      // when
      await service.load();

      // then
      assert.deepEqual(service.user, null);
    });
  });

  module('get isAuthenticated', function () {
    test('it returns true user is authenticated', async function (assert) {
      // given
      const service = this.owner.lookup('service:current-user');
      service.user = {
        pilotName: 'Bessie Coleman',
      };

      // when
      const isAuthenticated = service.isAuthenticated;

      // then
      assert.true(isAuthenticated);
    });

    test('it returns false user is not', async function (assert) {
      // given
      const service = this.owner.lookup('service:current-user');
      service.user = null;

      // when
      const isAuthenticated = service.isAuthenticated;

      // then
      assert.false(isAuthenticated);
    });
  });

  module('get pilotName', function () {
    test('it returns pilot name', async function (assert) {
      // given
      const service = this.owner.lookup('service:current-user');
      service.user = {
        pilotName: 'Harriet Quimby',
      };

      // when
      const pilotName = service.pilotName;

      // then
      assert.deepEqual(pilotName, 'Harriet Quimby');
    });
  });
});
