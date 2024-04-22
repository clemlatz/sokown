import { module, test } from 'qunit';
import { currentURL, click, fillIn } from '@ember/test-helpers';
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

module('Acceptance | ship', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('visiting /ships/:id', function () {
    test('it displays ship public information', async function (assert) {
      // when
      const screen = await visit('/');
      await click(screen.getByRole('link', { name: 'Ships' }));
      await click(screen.getByRole('link', { name: 'Artémis' }));

      // then
      assert.strictEqual(currentURL(), '/ships/1');
      assert
        .dom(screen.getByRole('heading', { name: 'Sokown', level: 1 }))
        .exists();
      assert
        .dom(screen.getByRole('heading', { name: 'Artémis', level: 2 }))
        .exists();
      assert
        .dom(screen.getByRole('definition', { name: 'Owner' }))
        .hasText('Anne Morrow Lindbergh');
      assert
        .dom(screen.getByRole('definition', { name: 'Speed' }))
        .hasText('100 km/s');
      assert
        .dom(screen.getByRole('definition', { name: 'Current location' }))
        .hasText('3.000 3.000 Moon');
      assert
        .dom(screen.getByRole('definition', { name: 'Current destination' }))
        .hasText('—');
      assert
        .dom(screen.getByRole('definition', { name: 'Time to destination' }))
        .hasText('300 seconds');
    });

    module('when user is anonymous', function () {
      test('it does not display autopilot form', async function (assert) {
        // given
        _userIsAnonymous(this as unknown as TestContext);

        // when
        const screen = await visit('/ships/1');

        // then
        assert.dom(screen.getByRole('link', { name: 'Log in' })).exists();
        assert
          .dom(screen.queryByRole('button', { name: 'Set Autopilot' }))
          .doesNotExist();
      });
    });

    module('when user is authenticated', function () {
      test('it displays autopilot form', async function (assert) {
        // when
        const screen = await visit('/ships/1');

        // then
        assert.dom(screen.getByRole('textbox', { name: 'X' })).exists();
        assert.dom(screen.getByRole('textbox', { name: 'Y' })).exists();
        assert
          .dom(screen.getByRole('button', { name: 'Set Autopilot' }))
          .exists();
      });
    });
  });

  test('visiting /ships/:id and updating destination', async function (assert) {
    // given
    // @ts-expect-error missing type
    this.server.create('ship', { id: 1 });

    // when
    const screen = await visit('/ships/1');
    await fillIn(screen.getByRole('textbox', { name: 'X' }), '17');
    await fillIn(screen.getByRole('textbox', { name: 'Y' }), '23');

    await click(screen.getByRole('button', { name: 'Set Autopilot' }));
    // then
    assert.strictEqual(currentURL(), '/ships/1');
    assert
      .dom(screen.getByRole('definition', { name: 'Current destination' }))
      .hasText('17.000 23.000');
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
