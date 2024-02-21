import { module, test } from 'qunit';
import { currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'sokown/tests/helpers';
import { visit } from '@1024pix/ember-testing-library';

module('Acceptance | sokown', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    // when
    const screen = await visit('/');

    // then
    assert.strictEqual(currentURL(), '/');
    assert.dom(screen.getByRole('heading', { name: 'Home' })).exists();
  });
});
