import { module, test } from 'qunit';

import { setupTest } from 'sokown-client/tests/helpers';

module('Unit | Model | location', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('location', {});
    assert.ok(model);
  });
});
