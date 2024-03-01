import { module, test } from 'qunit';
import { setupRenderingTest } from 'sokown-client/tests/helpers';
import { hbs } from 'ember-cli-htmlbars';
import { render } from '@1024pix/ember-testing-library';

module('Integration | Component | navbar', function (hooks) {
  setupRenderingTest(hooks);

  test('it display links', async function (assert) {
    // when
    const screen = await render(hbs`<Navbar />`);

    // then
    assert.dom(screen.getByRole('link', { name: 'Ships' })).exists();
    assert.dom(screen.getByRole('link', { name: 'About' })).exists();
  });

  module('when user is anonymous', function () {
    test('it displays login link', async function (assert) {
      // given
      const currentUser = this.owner.lookup('service:current-user');
      currentUser.user = null;

      // when
      const screen = await render(hbs`<Navbar />`);

      // then
      assert.dom(screen.getByRole('link', { name: 'Login' })).exists();
    });
  });

  module('when user is authenticated', function () {
    test('it displays pilot name', async function (assert) {
      // given
      const currentUser = this.owner.lookup('service:current-user');
      currentUser.user = {
        pilotName: 'Sheila Scott',
      };

      // when
      const screen = await render(hbs`<Navbar />`);
      const loginLink = await screen.queryByRole('link', { name: 'Login' });

      // then
      assert.dom(loginLink).doesNotExist();
      assert.dom(screen.getByText('Sheila Scott')).exists();
    });
  });
});
