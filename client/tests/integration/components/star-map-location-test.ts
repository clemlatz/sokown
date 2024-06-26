import { module, test } from 'qunit';
import { setupRenderingTest } from 'sokown-client/tests/helpers';
import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | star-map-location', function (hooks) {
  setupRenderingTest(hooks, {});

  test('it renders', async function (assert) {
    // given
    this.set('scale', 300);
    this.set('label', 'Twinkle Sun');
    this.set('color', 'yellow');
    this.set('position', { x: 0, y: 0 });
    this.set('primaryBodyPosition', null);
    this.set('distanceFromPrimaryBody', 0);

    const screen = await render(
      hbs`<StarMapLocation
        @scale={{this.scale}}
        @label={{this.label}}
        @color={{this.color}}
        @position={{this.position}}
        @primaryBodyPosition={{this.primaryBodyPosition}}
        @distanceFromPrimaryBody={{this.distanceFromPrimaryBody}}
      />`,
    );

    const starMapLocation = screen.getByLabelText('Twinkle Sun');
    assert.dom('text').hasText('Twinkle Sun');
    assert.dom('text').hasAttribute('x', '0');
    assert.dom('text').hasAttribute('y', '105');
    assert.dom(starMapLocation).hasAttribute('cx', '0');
    assert.dom(starMapLocation).hasAttribute('cy', '0');
    assert.dom(starMapLocation).hasAttribute('fill', 'yellow');
  });

  module('when location has a primary body', function () {
    test('it renders with orbit and gradient', async function (assert) {
      // given
      this.set('scale', 300);
      this.set('label', 'Twinkle');
      this.set('color', 'blue');
      this.set('position', { x: 690, y: 480 });
      this.set('primaryBodyPosition', { x: 0, y: 0 });
      this.set('distanceFromPrimaryBody', 525);

      const screen = await render(
        hbs`<StarMapLocation
          @scale={{this.scale}}
          @label={{this.label}}
          @color={{this.color}}
          @position={{this.position}}
          @primaryBodyPosition={{this.primaryBodyPosition}}
          @distanceFromPrimaryBody={{this.distanceFromPrimaryBody}}
        />`,
      );

      const starMapLocation = screen.getByLabelText('Twinkle');
      assert.dom('text').hasText('Twinkle');
      assert.dom('text').hasAttribute('x', '690');
      assert.dom('text').hasAttribute('y', '-375');
      assert.dom(starMapLocation).hasAttribute('cx', '690');
      assert.dom(starMapLocation).hasAttribute('cy', '-480');
      assert.dom(starMapLocation).hasAttribute('fill', 'url(#gradient)');
      assert
        .dom(starMapLocation)
        .hasAttribute('transform', 'rotate(-124.82448915695679)');
      assert
        .dom(screen.getByLabelText("Twinkle's orbit"))
        .hasAttribute('r', '525');
    });
  });

  module('when orbit radius is too small', function () {
    test('it is hidden', async function (assert) {
      // given
      this.set('scale', 300);
      this.set('label', 'Twinkle');
      this.set('position', { x: 690, y: 480 });
      this.set('primaryBodyPosition', { x: 0, y: 0 });
      this.set('distanceFromPrimaryBody', 10);

      const screen = await render(
        hbs`<StarMapLocation
          @scale={{this.scale}}
          @label={{this.label}}
          @position={{this.position}}
          @primaryBodyPosition={{this.primaryBodyPosition}}
          @distanceFromPrimaryBody={{this.distanceFromPrimaryBody}}
        />`,
      );

      assert.dom(screen.queryByLabelText('Twinkle')).doesNotExist();
    });
  });
});
