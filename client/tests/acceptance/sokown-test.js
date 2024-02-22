import { module, test } from 'qunit';
import { currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'sokown/tests/helpers';
import { visit } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | sokown', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /', async function (assert) {
    // when
    const screen = await visit('/');

    // then
    assert.strictEqual(currentURL(), '/');
    assert
      .dom(screen.getByRole('heading', { name: 'Sokown', level: 1 }))
      .exists();
    assert
      .dom(screen.getByRole('heading', { name: 'Home', level: 2 }))
      .exists();
  });

  test('visiting /about', async function (assert) {
    // when
    const screen = await visit('/');
    await click(screen.getByRole('link', { name: 'About' }));

    // then
    assert.strictEqual(currentURL(), '/about');
    assert
      .dom(screen.getByRole('heading', { name: 'Sokown', level: 1 }))
      .exists();
    assert
      .dom(screen.getByRole('heading', { name: 'About Sokown', level: 2 }))
      .exists();
  });

  test('visiting /ships', async function (assert) {
    // when
    const screen = await visit('/');
    await click(screen.getByRole('link', { name: 'Ships' }));

    // then
    assert.strictEqual(currentURL(), '/ships');
    assert
      .dom(screen.getByRole('heading', { name: 'Sokown', level: 1 }))
      .exists();
    assert
      .dom(screen.getByRole('heading', { name: 'Ships', level: 2 }))
      .exists();
    assert.dom(screen.getByRole('cell', { name: 'Artémis' })).exists();
    assert.dom(screen.getByRole('cell', { name: 'Bebop' })).exists();
  });
});
