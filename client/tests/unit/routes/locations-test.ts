import { module, test } from 'qunit';
import { setupTest } from 'sokown-client/tests/helpers';

module('Unit | Route | locations', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:locations/list');
    assert.ok(route);
  });
});
