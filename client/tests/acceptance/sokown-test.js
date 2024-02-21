import { module, test } from 'qunit';
import { currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'sokown/tests/helpers';
import { visit } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';

module('Acceptance | sokown', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    // when
    const screen = await visit('/');

    // then
    assert.strictEqual(currentURL(), '/');
    assert.dom(screen.getByRole('heading', { name: 'Home' })).exists();
  });

  test('visiting /about', async function (assert) {
    // when
    const screen = await visit('/');
    await click(screen.getByRole('link', { name: 'About' }));

    // then
    assert.strictEqual(currentURL(), '/about');
    assert.dom(screen.getByRole('heading', { name: 'About Sokown' })).exists();
  });
});
