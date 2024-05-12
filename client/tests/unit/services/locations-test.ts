import { module, test } from 'qunit';
import sinon from 'sinon';

import { setupTest } from 'sokown-client/tests/helpers';
import type Location from 'sokown-client/models/location';
import Ember from 'ember';

module('Unit | Service | Locations', function (hooks) {
  setupTest(hooks);

  module('load', function () {
    test('it loads locations', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const location = Symbol() as unknown as Location;
      const storeStub = sinon.stub(store, 'findAll');
      storeStub.resolves([location] as unknown as Ember.ArrayProxy<unknown>);
      const service = this.owner.lookup('service:locations');

      // when
      await service.load();

      // then
      assert.deepEqual(service.getAll(), [location]);
    });
  });
});
