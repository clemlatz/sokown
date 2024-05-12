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
      currentPosition: { x: 9, y: 12 },
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
      .hasAttribute('points', '0.3,-0.4 -0.7,2.6, 0.3,1.6 1.3,2.6');
    assert.dom(starMapShip).hasAttribute('transform', 'rotate(84)');
  });
});
