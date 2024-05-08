import { module, test } from 'qunit';
import { setupRenderingTest } from 'sokown-client/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | star-map', function (hooks) {
  setupRenderingTest(hooks, {});

  test('it renders', async function (assert) {
    // when
    await render(hbs`<StarMap />`);

    // then
    assert.dom('text').hasText('300 S.U.');
  });
});
