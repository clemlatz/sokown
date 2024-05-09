import { PrismaClient } from '@prisma/client';

import EventRepository from './EventRepository';
import ModelFactory from '../../test/ModelFactory';

describe('EventRepository', () => {
  describe('create', () => {
    test('it creates a new event', () => {
      // given
      const prisma = {
        event: {
          create: jest.fn(),
        },
      } as unknown as PrismaClient;
      const repository = new EventRepository(prisma);
      const ship = ModelFactory.createShip({ id: 1 });
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

      // when
      repository.create('Ship has arrived at Earth', ship, null);

      // then
      expect(prisma.event.create).toHaveBeenCalledWith({
        data: {
          shipId: 1,
          message: 'Ship has arrived at Earth',
          loggedAt: new Date('2020-01-01'),
          locationCode: undefined,
        },
      });
    });

    test('it creates a new event with a location', () => {
      // given
      const prisma = {
        event: {
          create: jest.fn(),
        },
      } as unknown as PrismaClient;
      const repository = new EventRepository(prisma);
      const ship = ModelFactory.createShip({ id: 1 });
      const location = ModelFactory.createLocation({});
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

      // when
      repository.create('Ship has arrived at Earth', ship, location);

      // then
      expect(prisma.event.create).toHaveBeenCalledWith({
        data: {
          shipId: 1,
          message: 'Ship has arrived at Earth',
          loggedAt: new Date('2020-01-01'),
          locationCode: 'earth',
        },
      });
    });
  });
});
