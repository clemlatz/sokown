import { module, test } from 'qunit';
import { setupTest } from 'sokown-client/tests/helpers';
import sinon from 'sinon';

module('Unit | Route | application', function (hooks) {
  setupTest(hooks);

  test('it loads current user', async function (assert) {
    // given
    let route = this.owner.lookup('route:application');
    const currentUser = this.owner.lookup('service:current-user');
    sinon.stub(currentUser, 'load');

    // when
    await route.model();

    // then
    assert.true(currentUser.load.calledOnce);
  });
});
