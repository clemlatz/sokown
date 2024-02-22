import { module, test } from 'qunit';
import { setupTest } from 'sokown/tests/helpers';

module('Unit | Route | ships', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:ships');
    assert.ok(route);
  });
});
