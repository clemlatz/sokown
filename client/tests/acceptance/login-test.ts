import { module, test } from 'qunit';
import { currentURL, click } from '@ember/test-helpers';
import { visit } from '@1024pix/ember-testing-library';
import 'qunit-dom';
import { Response } from 'miragejs';

import { setupApplicationTest, setupMirage } from 'sokown-client/tests/helpers';

type TestContext = {
  server: {
    get: (url: string, callback: () => Response) => void;
  };
};

module('Acceptance | user/login', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('when user is anonymous', () => {
    test('displays login button', async function (assert) {
      // given
      _userIsAnonymous(this as unknown as TestContext);

      // when
      const screen = await visit('/');
      await click(screen.getByRole('link', { name: 'Log in' }));

      // then
      assert.strictEqual(currentURL(), '/user/login');
      assert
        .dom(screen.getByRole('heading', { name: 'Login', level: 2 }))
        .exists();
      assert
        .dom(
          screen.getByRole('link', {
            name: 'Log in / Sign up with Axys',
          }),
        )
        .exists();
    });
  });

  module('when user is already logged in', () => {
    test('redirects to ships page', async function (assert) {
      // when
      await visit('/user/login');

      // then
      assert.strictEqual(currentURL(), '/ships');
    });
  });
});

function _userIsAnonymous(context: TestContext) {
  context.server.get('/api/users/me', () => {
    return new Response(
      401,
      {},
      {
        errors: [
          {
            status: 401,
            title: 'Unauthorized',
          },
        ],
      },
    );
  });
}
