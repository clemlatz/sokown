import { module, test } from 'qunit';
import { currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'sokown-client/tests/helpers';
import { visit } from '@1024pix/ember-testing-library';
import { click, fillIn } from '@ember/test-helpers';
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
      .dom(
        screen.getByRole('heading', {
          name: 'Welcome to The Sokown Company',
          level: 2,
        }),
      )
      .exists();
    assert.dom(screen.getByRole('link', { name: 'Join now' })).exists();
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

  test('visiting /ships/:id', async function (assert) {
    // when
    const screen = await visit('/');
    await click(screen.getByRole('link', { name: 'Ships' }));
    await click(screen.getByRole('link', { name: 'Artémis' }));

    // then
    assert.strictEqual(currentURL(), '/ships/1');
    assert
      .dom(screen.getByRole('heading', { name: 'Sokown', level: 1 }))
      .exists();
    assert
      .dom(screen.getByRole('heading', { name: 'Artémis', level: 2 }))
      .exists();
    assert
      .dom(screen.getByRole('definition', { name: 'Speed' }))
      .hasText('100 km/s');
    assert
      .dom(screen.getByRole('definition', { name: 'Current location' }))
      .hasText('3 3 Moon');
    assert
      .dom(screen.getByRole('definition', { name: 'Current destination' }))
      .hasText('—');
  });

  test('visiting /ships/:id and updating destination', async function (assert) {
    // given
    this.server.create('ship', { id: 1 });

    // when
    const screen = await visit('/ships/1');
    await fillIn(screen.getByRole('textbox', { name: 'X' }), '17');
    await fillIn(screen.getByRole('textbox', { name: 'Y' }), '23');

    await click(screen.getByRole('button', { name: 'Set Autopilot' }));
    // then
    assert.strictEqual(currentURL(), '/ships/1');
    assert
      .dom(screen.getByRole('definition', { name: 'Current destination' }))
      .hasText('17 23');
  });
});
