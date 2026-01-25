import { module, test } from 'qunit';
import { visit } from '@1024pix/ember-testing-library';
import { click, fillIn } from '@ember/test-helpers';
import 'qunit-dom';

import { setupApplicationTest, setupMirage } from 'sokown-client/tests/helpers';

module('Acceptance | locations', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('visiting /locations/', function () {
    test('it displays locations list', async function (assert) {
      // when
      const screen = await visit('/locations');

      // then
      assert
        .dom(
          screen.getByRole('heading', {
            name: 'Locations',
            level: 2,
          }),
        )
        .exists();
      assert.dom(screen.getByRole('cell', { name: 'Earth' })).exists();
      assert.dom(screen.getByRole('cell', { name: 'Moon' })).exists();
      assert.dom(
        screen.getByRole('img', { name: 'A star map of the solar system' }),
      );
    });
  });

  module('visiting /locations/:id', function () {
    test('it displays a single location', async function (assert) {
      // when
      const screen = await visit('/locations');
      await click(screen.getByRole('link', { name: 'Moon' }));

      // then
      assert
        .dom(
          screen.getByRole('heading', {
            name: 'Moon',
            level: 2,
          }),
        )
        .exists();
      assert
        .dom(screen.getByRole('definition', { name: 'Current position' }))
        .hasText('1.000 2.000');
      assert
        .dom(screen.queryByRole('definition', { name: 'Future position' }))
        .doesNotExist();
    });

    module('calculating future position', function () {
      test('it queries and displays future position for target date', async function (assert) {
        // when
        const screen = await visit('/locations/moon');
        await fillIn(
          screen.getByLabelText('Target date'),
          '2019-04-28T02:42:00',
        );
        await click(screen.getByRole('button', { name: 'Calculate' }));

        // then
        assert
          .dom(
            await screen.findByRole('definition', { name: 'Future position' }),
          )
          .hasText('1.000 2.000');
      });
    });
  });
});
