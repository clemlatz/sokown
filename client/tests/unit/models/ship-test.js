import { module, test } from 'qunit';

import { setupTest } from 'sokown-client/tests/helpers';

module('Unit | Model | ship', function (hooks) {
  setupTest(hooks);

  module('isStationary', function () {
    test('it returns true if ship does not have a destination', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const ship = store.createRecord('ship', {
        destinationPosition: null,
      });

      // when
      const isStationary = ship.isStationary;

      // then
      assert.true(isStationary);
    });

    test('it returns false if ship does has a destination', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const ship = store.createRecord('ship', {
        destinationPosition: { x: 1, y: 2 },
      });

      // when
      const isStationary = ship.isStationary;

      // then
      assert.false(isStationary);
    });
  });

  module('getRelativeTimeOfArrival', () => {
    test('it returns the time of arrival relative to now', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const ship = store.createRecord('ship', {
        timeToDestination: 300,
      });

      // when
      const relativeTimeOfArrival = ship.relativeTimeOfArrival;

      // then
      assert.strictEqual(relativeTimeOfArrival, '5 minutes');
    });
  });
});
