import { module, test } from 'qunit';
import { setupTest } from 'sokown/tests/helpers';

module('Unit | Controller | ships', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:ships');
    assert.ok(controller);
  });
});
