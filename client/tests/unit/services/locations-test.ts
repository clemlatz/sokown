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

  module('subscribe', function (hooks) {
    let originalEventSource: typeof EventSource;
    let mockEventSource: sinon.SinonStubbedInstance<EventSource>;
    let eventListeners: Record<string, EventListener>;

    hooks.beforeEach(function () {
      originalEventSource = window.EventSource;
      eventListeners = {};

      mockEventSource = {
        addEventListener: sinon
          .stub()
          .callsFake((type: string, listener: EventListener) => {
            eventListeners[type] = listener;
          }),
        close: sinon.stub(),
      } as unknown as sinon.SinonStubbedInstance<EventSource>;

      window.EventSource = sinon
        .stub()
        .returns(mockEventSource) as unknown as typeof EventSource;
    });

    hooks.afterEach(function () {
      window.EventSource = originalEventSource;
    });

    test('it creates an EventSource to /api/locations/live', function (assert) {
      // given
      const service = this.owner.lookup('service:locations');

      // when
      service.subscribe();

      // then
      assert.true(
        (window.EventSource as unknown as sinon.SinonStub).calledWith(
          '/api/locations/live',
        ),
      );
    });

    test('it listens for message events', function (assert) {
      // given
      const service = this.owner.lookup('service:locations');

      // when
      service.subscribe();

      // then
      assert.true(
        mockEventSource.addEventListener.calledWith(
          'message',
          sinon.match.func,
        ),
      );
    });

    test('it pushes received data to the store', function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const pushStub = sinon.stub(store, 'push');
      const service = this.owner.lookup('service:locations');
      service.subscribe();

      const locationData = [
        { id: 'earth', type: 'location', attributes: { name: 'Earth' } },
      ];

      // when
      const messageEvent = new MessageEvent('message', {
        data: JSON.stringify(locationData),
      });
      eventListeners['message']!(messageEvent);

      // then
      assert.true(pushStub.calledWith({ data: locationData }));
    });
  });

  module('willDestroy', function (hooks) {
    let originalEventSource: typeof EventSource;
    let mockEventSource: sinon.SinonStubbedInstance<EventSource>;

    hooks.beforeEach(function () {
      originalEventSource = window.EventSource;

      mockEventSource = {
        addEventListener: sinon.stub(),
        close: sinon.stub(),
      } as unknown as sinon.SinonStubbedInstance<EventSource>;

      window.EventSource = sinon
        .stub()
        .returns(mockEventSource) as unknown as typeof EventSource;
    });

    hooks.afterEach(function () {
      window.EventSource = originalEventSource;
    });

    test('it unsubscribes from the EventSource', function (assert) {
      // given
      const service = this.owner.lookup('service:locations');
      service.subscribe();

      // when
      service.willDestroy();

      // then
      assert.true(mockEventSource.close.calledOnce);
    });

    test('it does nothing if not subscribed', function (assert) {
      // given
      const service = this.owner.lookup('service:locations');

      // when
      service.willDestroy();

      // then
      assert.true(mockEventSource.close.notCalled);
    });
  });
});
