import { module, test } from 'qunit';
import { setupTest } from 'sokown-client/tests/helpers';

module('Unit | Controller | user/signup', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const controller = this.owner.lookup('controller:user/signup');
    assert.ok(controller);
  });
});
