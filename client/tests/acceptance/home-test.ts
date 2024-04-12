import { module, test } from 'qunit';
import { currentURL } from '@ember/test-helpers';
import { visit } from '@1024pix/ember-testing-library';
import { setupMirage } from 'ember-cli-mirage/test-support';
import 'qunit-dom';
import { Response } from 'miragejs';

import { setupApplicationTest } from 'sokown-client/tests/helpers';

type TestContext = {
  server: {
    get: (url: string, callback: () => Response) => void;
  };
};

module('Acceptance | home', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('when user is not authenticated', function () {
    test('it displays home page', async function (assert) {
      // given
      _userIsAnonymous(this as unknown as TestContext);

      // when
      const screen = await visit('/');

      // then
      assert.strictEqual(currentURL(), '/');
      assert
        .dom(screen.getByRole('heading', { name: 'Sokown', level: 1 }))
        .exists();
      assert
        .dom(
          screen.getByRole('heading', {
            name: 'Welcome to The Sokown Company',
            level: 2,
          }),
        )
        .exists();
      assert.dom(screen.getByRole('link', { name: 'Join now' })).exists();
    });

    test('it displays login link', async function (assert) {
      // given
      _userIsAnonymous(this as unknown as TestContext);

      // when
      const screen = await visit('/');

      // then
      assert.dom(screen.getByRole('link', { name: 'Login' })).exists();
    });
  });

  module('when user is authenticated', function () {
    test('it redirects to ships page and displays pilot name', async function (assert) {
      // when
      const screen = await visit('/');

      // then
      assert.strictEqual(currentURL(), '/ships');
      assert.dom(screen.getByText('Amy Johnson')).exists();
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
