import { module, test } from 'qunit';
import { setupRenderingTest } from 'sokown/tests/helpers';
import { hbs } from 'ember-cli-htmlbars';
import { render } from '@1024pix/ember-testing-library';

module('Integration | Component | container', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // when
    const screen = await render(hbs`<Container><h2>Page title</h2></Container>`);

    // then
    assert.dom(screen.getByRole('heading', { name: 'Sokown', level: 1 })).exists();
    assert.dom(screen.getByRole('heading', { name: 'Page title', level: 2 })).exists();
  });
});
