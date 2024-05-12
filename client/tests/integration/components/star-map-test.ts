import { module, test } from 'qunit';
import { setupRenderingTest } from 'sokown-client/tests/helpers';
import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | star-map', function (hooks) {
  setupRenderingTest(hooks, {});

  test('it displays locations and ship', async function (assert) {
    // given
    this.set('locations', [
      {
        name: 'Earth',
        position: { x: 3, y: 4 },
      },
    ]);
    this.set('ship', {
      name: 'Artémis',
      currentPosition: { x: 6, y: 7 },
    });

    // when
    const screen = await render(
      hbs`<StarMap @locations={{this.locations}} @ship={{this.ship}} />`,
    );

    // then
    assert.dom('text').hasText('300 S.U.');
    assert.dom(screen.getByLabelText('Earth')).exists();
    assert.dom(screen.getByLabelText('Artémis')).exists();
  });
});
