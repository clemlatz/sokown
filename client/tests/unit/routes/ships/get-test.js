import { module, test } from 'qunit';
import { setupTest } from 'sokown-client/tests/helpers';

module('Unit | Route | ships/get', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:ships/get');
    assert.ok(route);
  });
});
