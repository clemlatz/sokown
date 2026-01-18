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

  module('trajectory line', function () {
    test('it renders trajectory line when showTrajectory is true and ship is moving', async function (assert) {
      // given
      const ship = {
        name: 'Daedalus',
        currentPosition: { x: 100, y: 200 },
        currentCourse: 45,
        isStationary: false,
        destinationPosition: { x: 300, y: 400 },
        destinationLocation: { name: 'Mars' },
      };
      this.set('scale', 300);
      this.set('ship', ship);
      this.set('showTrajectory', true);

      // when
      const screen = await render(
        hbs`<StarMapShip @scale={{this.scale}} @ship={{this.ship}} @showTrajectory={{this.showTrajectory}} />`,
      );

      // then
      const trajectoryLine = screen.getByLabelText('Trajectory to Mars');
      assert.dom(trajectoryLine).exists();
      assert.dom(trajectoryLine).hasAttribute('x1', '100');
      assert.dom(trajectoryLine).hasAttribute('y1', '-200');
      assert.dom(trajectoryLine).hasAttribute('x2', '300');
      assert.dom(trajectoryLine).hasAttribute('y2', '-400');
    });

    test('it applies correct styling attributes to trajectory line', async function (assert) {
      // given
      const ship = {
        name: 'Daedalus',
        currentPosition: { x: 100, y: 200 },
        currentCourse: 45,
        isStationary: false,
        destinationPosition: { x: 300, y: 400 },
        destinationLocation: { name: 'Mars' },
      };
      this.set('scale', 300);
      this.set('ship', ship);
      this.set('showTrajectory', true);

      // when
      const screen = await render(
        hbs`<StarMapShip @scale={{this.scale}} @ship={{this.ship}} @showTrajectory={{this.showTrajectory}} />`,
      );

      // then
      const trajectoryLine = screen.getByLabelText('Trajectory to Mars');
      assert.dom(trajectoryLine).hasAttribute('stroke', 'lightblue');
      assert.dom(trajectoryLine).hasAttribute('stroke-width', '0.3%');
      assert.dom(trajectoryLine).hasAttribute('stroke-dasharray', '0.5% 0.5%');
      assert.dom(trajectoryLine).hasAttribute('opacity', '0.6');
      assert.dom(trajectoryLine).hasClass('trajectory');
    });

    test('it does not render trajectory line when showTrajectory is false', async function (assert) {
      // given
      const ship = {
        name: 'Daedalus',
        currentPosition: { x: 100, y: 200 },
        currentCourse: 45,
        isStationary: false,
        destinationPosition: { x: 300, y: 400 },
        destinationLocation: { name: 'Mars' },
      };
      this.set('scale', 300);
      this.set('ship', ship);
      this.set('showTrajectory', false);

      // when
      const screen = await render(
        hbs`<StarMapShip @scale={{this.scale}} @ship={{this.ship}} @showTrajectory={{this.showTrajectory}} />`,
      );

      // then
      const trajectoryLine = screen.queryByLabelText('Trajectory to Mars');
      assert.dom(trajectoryLine).doesNotExist();
    });

    test('it does not render trajectory line when ship is stationary', async function (assert) {
      // given
      const ship = {
        name: 'Daedalus',
        currentPosition: { x: 100, y: 200 },
        currentCourse: 45,
        isStationary: true,
        destinationPosition: null,
        destinationLocation: null,
      };
      this.set('scale', 300);
      this.set('ship', ship);
      this.set('showTrajectory', true);

      // when
      await render(
        hbs`<StarMapShip @scale={{this.scale}} @ship={{this.ship}} @showTrajectory={{this.showTrajectory}} />`,
      );

      // then
      const trajectoryLine = document.querySelector('.trajectory');
      assert.strictEqual(trajectoryLine, null);
    });

    test('it handles null destinationLocation gracefully', async function (assert) {
      // given
      const ship = {
        name: 'Daedalus',
        currentPosition: { x: 100, y: 200 },
        currentCourse: 45,
        isStationary: false,
        destinationPosition: { x: 300, y: 400 },
        destinationLocation: null,
      };
      this.set('scale', 300);
      this.set('ship', ship);
      this.set('showTrajectory', true);

      // when
      const screen = await render(
        hbs`<StarMapShip @scale={{this.scale}} @ship={{this.ship}} @showTrajectory={{this.showTrajectory}} />`,
      );

      // then
      const trajectoryLine = screen.getByLabelText('Trajectory');
      assert.dom(trajectoryLine).exists();
      assert.dom(trajectoryLine).hasAttribute('x1', '100');
      assert.dom(trajectoryLine).hasAttribute('y1', '-200');
      assert.dom(trajectoryLine).hasAttribute('x2', '300');
      assert.dom(trajectoryLine).hasAttribute('y2', '-400');
    });
  });
});
