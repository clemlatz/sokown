import { module, test } from 'qunit';
import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { click } from '@ember/test-helpers';

import { setupRenderingTest } from 'sokown-client/tests/helpers';
import stubLocalStorage from 'sokown-client/tests/helpers/local-storage-stub';

stubLocalStorage({});

module('Integration | Component | star-map', function (hooks) {
  setupRenderingTest(hooks, {});

  test('it displays the map centered on the sun with locations', async function (assert) {
    // given
    this.set('locations', [
      {
        name: 'Earth',
        position: { x: 3, y: 4 },
      },
    ]);

    // when
    const screen = await render(
      hbs`<StarMap @locations={{this.locations}}  />`,
    );

    // then
    const starMap = screen.getByLabelText('A star map of the solar system');
    assert.dom(starMap).exists();
    assert.dom(starMap).hasAttribute('viewBox', '-1280 -1280 2560 2560');
    assert.dom(screen.getByLabelText('Scale')).hasText('256 S.U.');
    assert.dom(screen.getByLabelText('Earth')).exists();
  });

  module('with a ship', function () {
    test('it displays the map centered on the ship', async function (assert) {
      // given
      this.set('locations', [
        {
          name: 'Earth',
          position: { x: 3, y: 4 },
        },
      ]);
      this.set('ship', {
        name: 'Artémis',
        currentPosition: { x: 100, y: 200 },
      });

      // when
      const screen = await render(
        hbs`<StarMap @locations={{this.locations}} @ship={{this.ship}} />`,
      );

      // then
      const starMap = screen.getByLabelText('A star map of the solar system');
      assert.dom(starMap).hasAttribute('viewBox', '-1180 -1480 2560 2560');
      assert.dom(screen.getByLabelText('Artémis')).exists();
    });
  });

  module('when a scale is provided', function () {
    test('it displays the map zoomed at given scale', async function (assert) {
      // given
      this.set('locations', []);

      // when
      const screen = await render(
        hbs`<StarMap @locations={{this.locations}} @scale={{32}} />`,
      );

      // then
      const starMap = screen.getByLabelText('A star map of the solar system');
      assert.dom(starMap).hasAttribute('viewBox', '-160 -160 320 320');
    });
  });

  module('when zooming in', function () {
    test('it reduces map scale', async function (assert) {
      // given
      const localStorage = stubLocalStorage({ locations: 32, ship: 32 });
      this.set('locations', []);
      const screen = await render(
        hbs`<StarMap @locations={{this.locations}} @scale={{32}} @key="locations" />`,
      );

      // when
      await click(screen.getByRole('button', { name: 'Zoom in' }));

      // then
      const starMap = screen.getByLabelText('A star map of the solar system');
      assert.dom(starMap).hasAttribute('viewBox', '-80 -80 160 160');
      assert.dom(screen.getByLabelText('Scale')).hasText('16 S.U.');
      assert.true(
        localStorage.setItem.calledWith(
          'zoomLevels',
          '{"locations":16,"ship":32}',
        ),
      );
    });
  });

  module('when zooming out', function () {
    test('it increases map scale', async function (assert) {
      // given
      const localStorage = stubLocalStorage({ locations: 32, ship: 32 });
      this.set('locations', []);
      const screen = await render(
        hbs`<StarMap @locations={{this.locations}} @scale={{32}} @key={{"locations"}} />`,
      );

      // when
      await click(screen.getByRole('button', { name: 'Zoom out' }));

      // then
      const starMap = screen.getByLabelText('A star map of the solar system');
      assert.dom(starMap).hasAttribute('viewBox', '-320 -320 640 640');
      assert.dom(screen.getByLabelText('Scale')).hasText('64 S.U.');
      assert.true(
        localStorage.setItem.calledWith(
          'zoomLevels',
          '{"locations":64,"ship":32}',
        ),
      );
    });
  });
});
