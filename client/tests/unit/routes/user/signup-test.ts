import { module, test } from 'qunit';
import { setupTest } from 'sokown-client/tests/helpers';

module('Unit | Route | user/signup', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:user/signup');
    assert.ok(route);
  });
});
