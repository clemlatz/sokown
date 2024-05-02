import { module, test } from 'qunit';
import { visit } from '@1024pix/ember-testing-library';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { click } from '@ember/test-helpers';
import 'qunit-dom';

import { setupApplicationTest } from 'sokown-client/tests/helpers';

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
    });
  });
});
