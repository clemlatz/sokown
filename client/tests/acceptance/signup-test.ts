import { module, test } from 'qunit';
import { currentURL, fillIn } from '@ember/test-helpers';
import { setupApplicationTest, setupMirage } from 'sokown-client/tests/helpers';
import { visit } from '@1024pix/ember-testing-library';
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
        .dom(screen.getByRole('textbox', { name: 'Ship name' }))
        .hasValue("Amy Johnson's ship");
      assert
        .dom(screen.getByRole('button', { name: 'Register Pilot' }))
        .exists();
    });

    module('when username is not defined', function () {
      test('it does not prefill inputs', async function (assert) {
        // given
        // @ts-expect-error missing type
        this.server.get('/api/authentication-methods/current', () => {
          return {
            data: {
              id: 'current',
              type: 'authenticationMethod',
              attributes: {
                idTokenClaims: {
                  sub: 1,
                  email: 'amy.johnson@example.net',
                  username: null,
                },
              },
            },
          };
        });

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
          .hasValue('');
        assert
          .dom(screen.getByRole('textbox', { name: 'Ship name' }))
          .hasValue('');
        assert
          .dom(screen.getByRole('button', { name: 'Register Pilot' }))
          .exists();
      });
    });

    module('when submitting the form', function () {
      test('when an error occurs', async function (assert) {
        // given
        // @ts-expect-error missing type
        this.server.post(
          '/api/users',
          () => ({
            errors: [
              {
                statusCode: 400,
                title: 'This pilot name is already taken',
              },
            ],
          }),
          400,
        );
        const screen = await visit('/user/signup');

        // when
        await fillIn(
          await screen.getByRole('textbox', { name: 'Pilot name' }),
          'Bessie Coleman',
        );
        await fillIn(
          await screen.getByRole('textbox', { name: 'Ship name' }),
          'Jenny',
        );
        await screen.getByRole('button', { name: 'Register Pilot' }).click();

        // then
        assert.strictEqual(currentURL(), '/user/signup');
        assert
          .dom(await screen.findByText('This pilot name is already taken'))
          .exists();
      });

      test('it creates a new user', async function (assert) {
        // given
        const screen = await visit('/user/signup');

        // when
        await fillIn(
          await screen.getByRole('textbox', { name: 'Pilot name' }),
          'Bessie Coleman',
        );
        await fillIn(
          await screen.getByRole('textbox', { name: 'Ship name' }),
          'Jenny',
        );
        await screen.getByRole('button', { name: 'Register Pilot' }).click();

        // then
        assert.strictEqual(currentURL(), '/user/signup');
        assert
          .dom(await screen.findByText('Registration successful!'))
          .exists();
        assert.dom(screen.getByRole('link', { name: 'Continue' })).exists();
      });
    });
  });
});
