import { module, test } from 'qunit';
import { currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'sokown-client/tests/helpers';
import { visit } from '@1024pix/ember-testing-library';
import { setupMirage } from 'ember-cli-mirage/test-support';
import 'qunit-dom';

module('Acceptance | signup', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('when visiting /user/signup', function () {
    test('it display prefilled signup form', async function (assert) {
      // when
      const screen = await visit('/user/signup');

      // then
      assert.strictEqual(currentURL(), '/user/signup');
      assert
        .dom(
          screen.getByRole('heading', {
            name: 'Register new pilot',
            level: 2,
          }),
        )
        .exists();
      assert
        .dom(screen.getByRole('textbox', { name: 'E-mail address' }))
        .hasValue('amy.johnson@example.net');
      assert
        .dom(screen.getByRole('textbox', { name: 'Pilot name' }))
        .hasValue('Amy Johnson');
      assert
        .dom(screen.getByRole('button', { name: 'Register Pilot' }))
        .exists();
    });
  });
});
