import { module, test } from 'qunit';
import { setupRenderingTest } from 'sokown/tests/helpers';
import { hbs } from 'ember-cli-htmlbars';
import { render } from '@1024pix/ember-testing-library';

module('Integration | Component | position', function (hooks) {
  setupRenderingTest(hooks);

  test('it displays coordinates for given position', async function (assert) {
    // given
    const position = { x: 1, y: 2 };
    this.set('position', position);

    // when
    const screen = await render(hbs`<Position @position={{this.position}} />`);

    // then
    assert
      .dom(screen.getByRole('definition', { name: 'Coordinate X' }))
      .hasText('1');
    assert
      .dom(screen.getByRole('definition', { name: 'Coordinate Y' }))
      .hasText('2');
  });

  test('it displays an hyphen if position is null', async function (assert) {
    // given
    const position = null;
    this.set('position', position);

    // when
    const screen = await render(hbs`<Position @position={{this.position}} />`);

    // then
    assert.dom(screen.getByRole('group', { name: 'Position' })).hasText('—');
  });
});
