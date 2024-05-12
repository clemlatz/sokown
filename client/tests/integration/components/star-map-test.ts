import { module, test } from 'qunit';
import { setupRenderingTest } from 'sokown-client/tests/helpers';
import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';

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
    assert.dom(starMap).hasAttribute('viewBox', '-1500 -1500 3000 3000');
    assert.dom(screen.getByLabelText('Scale')).hasText('300 S.U.');
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
      assert.dom(starMap).hasAttribute('viewBox', '-1400 -1700 3000 3000');
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
});
