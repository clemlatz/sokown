import { module, test } from 'qunit';
import sinon from 'sinon';

import { setupTest } from 'sokown-client/tests/helpers';
import type LocationGetController from 'sokown-client/controllers/locations/get';

module('Unit | Controller | location/get', function (hooks) {
  setupTest(hooks);

  module('setTargetDate', function () {
    test('it sets target date', function (assert) {
      // given
      const controller = this.owner.lookup(
        'controller:locations/get',
      ) as LocationGetController;
      controller.set('targetDate', '2013-05-22T13:30:00');
      const event = {
        target: { value: '2019-04-28T02:42:00' },
      } as unknown as Event;

      // when
      controller.setTargetDate(event);

      // then
      assert.strictEqual(controller.get('targetDate'), '2019-04-28T02:42:00');
    });
  });

  module('calculateFuturePosition', function () {
    test('it queries api for future position', async function (assert) {
      // given
      const controller = this.owner.lookup(
        'controller:locations/get',
      ) as LocationGetController;
      controller.set('model', { id: 'moon' });
      controller.set('targetDate', '2013-05-22T21:30:00');
      const event = new Event('submit');

      const fetchStub = sinon.stub(window, 'fetch');
      const body = JSON.stringify({ data: { attributes: { x: 1, y: 2 } } });
      const response = new Response(body);
      fetchStub.resolves(response);

      // when
      await controller.calculateFuturePosition(event);

      // then
      assert.ok(fetchStub.calledOnce);
      assert.deepEqual(controller.get('futurePosition'), { x: 1, y: 2 });
    });
  });
});
