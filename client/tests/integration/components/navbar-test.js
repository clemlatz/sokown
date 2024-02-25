import { module, test } from 'qunit';
import { setupRenderingTest } from 'sokown-client/tests/helpers';
import { hbs } from 'ember-cli-htmlbars';
import { render } from '@1024pix/ember-testing-library';

module('Integration | Component | navbar', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // when
    const screen = await render(hbs`<Navbar />`);

    // then
    assert.dom(screen.getByRole('link', { name: 'Home' })).exists();
    assert.dom(screen.getByRole('link', { name: 'Ships' })).exists();
    assert.dom(screen.getByRole('link', { name: 'About' })).exists();
  });
});
