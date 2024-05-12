import { module, test } from 'qunit';
import { setupRenderingTest } from 'sokown-client/tests/helpers';
import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | star-map-ship', function (hooks) {
  setupRenderingTest(hooks, {});

  test('it renders', async function (assert) {
    // given
    const ship = {
      name: 'Daedalus',
      currentPosition: { x: 90, y: 120 },
      currentCourse: 84,
    };
    this.set('scale', 300);
    this.set('ship', ship);

    // when
    const screen = await render(
      hbs`<StarMapShip @scale={{this.scale}} @ship={{this.ship}} />`,
    );

    // then
    const starMapShip = screen.getByLabelText('Daedalus');
    assert
      .dom(starMapShip)
      .hasAttribute('points', '90,-120 60,-30, 90,-60 120,-30');
    assert.dom(starMapShip).hasAttribute('transform', 'rotate(84)');
  });
});
