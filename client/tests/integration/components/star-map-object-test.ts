import { module, test } from 'qunit';
import { setupRenderingTest } from 'sokown-client/tests/helpers';
import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | star-map-object', function (hooks) {
  setupRenderingTest(hooks, {});

  test('it renders', async function (assert) {
    // given
    this.set('scale', 300);
    this.set('label', 'Twinkle');
    this.set('position', { x: 690, y: 480 });
    this.set('primaryBodyPosition', { x: 0, y: 0 });
    this.set('distanceFromPrimaryBody', 525);

    const screen = await render(
      hbs`<StarMapObject
        @scale={{this.scale}}
        @label={{this.label}}
        @position={{this.position}}
        @primaryBodyPosition={{this.primaryBodyPosition}}
        @distanceFromPrimaryBody={{this.distanceFromPrimaryBody}}
      />`,
    );

    assert.dom('text').hasText('Twinkle');
    assert.dom('text').hasAttribute('x', '23');
    assert.dom('text').hasAttribute('Y', '-12.5');
    assert.dom(screen.getByLabelText('Twinkle')).hasAttribute('cx', '23');
    assert.dom(screen.getByLabelText('Twinkle')).hasAttribute('cy', '-16');
    assert
      .dom(screen.getByLabelText("Twinkle's orbit"))
      .hasAttribute('r', '17.5');
  });
});
