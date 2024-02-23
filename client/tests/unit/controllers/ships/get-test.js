import { module, test } from 'qunit';
import { setupTest } from 'sokown/tests/helpers';

module('Unit | Controller | ships/get', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:ships/get');
    assert.ok(controller);
  });
});
