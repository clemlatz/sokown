import ShipRepository, { ShipDTO } from './ShipRepository';
import { PrismaClient } from '@prisma/client';
import Position from '../models/Position';
import ModelFactory from '../../test/ModelFactory';
import User from '../models/User';

describe('ShipRepository', () => {
  describe('getAll', () => {
    test('it gets all the ships', async () => {
      // given
      const givenShips: ShipDTO[] = [
        {
          id: 1,
          owner: {
            id: 3,
            pilotName: 'Owner 3',
          },
          name: 'Ship 1',
          speed: 1,
          currentPositionX: 1,
          currentPositionY: 2,
          destinationPositionX: 3,
          destinationPositionY: 4,
        },
        {
          id: 2,
          owner: {
            id: 4,
            pilotName: 'Owner 4',
          },
          name: 'Ship 2',
          speed: 0.5,
          currentPositionX: 5,
          currentPositionY: 6,
          destinationPositionX: 0,
          destinationPositionY: 0,
        },
      ];
      const prisma = {
        ship: {
          findMany: jest.fn(() => givenShips),
        },
      } as unknown as PrismaClient;
      const repository = new ShipRepository(prisma);

      // when
      const ships = await repository.getAll();

      // then
      expect(prisma.ship.findMany).toHaveBeenCalledWith({
        include: {
          owner: true,
        },
      });
      const expectedShip1 = ModelFactory.createShip({
        id: 1,
        owner: new User(3, 'Owner 3'),
        name: 'Ship 1',
        speed: 1,
        currentPosition: new Position(1, 2),
        destinationPosition: new Position(3, 4),
      });
      const expectedShip2 = ModelFactory.createShip({
        id: 2,
        owner: new User(4, 'Owner 4'),
        name: 'Ship 2',
        speed: 0.5,
        currentPosition: new Position(5, 6),
        destinationPosition: new Position(0, 0),
      });
      expect(ships.length).toEqual(2);
      expect(ships).toContainEqual(expectedShip1);
      expect(ships).toContainEqual(expectedShip2);
    });
  });

  describe('getShipsWithDestination', () => {
    test('it gets all the ships with a destination set', async () => {
      // given
      const givenShips: ShipDTO[] = [
        {
          id: 1,
          owner: {
            id: 2,
            pilotName: 'Owner 2',
          },
          name: 'Ship',
          speed: 100,
          currentPositionX: 1,
          currentPositionY: 2,
          destinationPositionX: 3,
          destinationPositionY: 4,
        },
      ];
      const prisma = {
        ship: {
          findMany: jest.fn(() => givenShips),
        },
      } as unknown as PrismaClient;
      const repository = new ShipRepository(prisma);

      // when
      const ships = await repository.getShipsWithDestination();

      // then
      const expectedPosition = new Position(1, 2);
      const expectedDestination = new Position(3, 4);
      const expectedShip = ModelFactory.createShip({
        id: 1,
        owner: new User(2, 'Owner 2'),
        speed: 100,
        name: 'Ship',
        currentPosition: expectedPosition,
        destinationPosition: expectedDestination,
      });
      expect(prisma.ship.findMany).toHaveBeenCalledWith({
        where: {
          destinationPositionX: { not: null },
          destinationPositionY: { not: null },
        },
        include: { owner: true },
      });
      expect(ships).toContainEqual(expectedShip);
    });
  });

  describe('getById', () => {
    test('it returns ship for given id', async () => {
      // given
      const givenShip: ShipDTO = {
        id: 1,
        owner: {
          id: 2,
          pilotName: 'Owner 2',
        },
        name: 'Ship',
        speed: 100,
        currentPositionX: 1,
        currentPositionY: 2,
        destinationPositionX: 3,
        destinationPositionY: 4,
      };
      const prisma = {
        ship: {
          findFirst: jest.fn(() => givenShip),
        },
      } as unknown as PrismaClient;
      const repository = new ShipRepository(prisma);

      // when
      const ship = await repository.getById(1);

      // then
      const expectedPosition = new Position(1, 2);
      const expectedDestination = new Position(3, 4);
      const expectedShip = ModelFactory.createShip({
        id: 1,
        owner: new User(2, 'Owner 2'),
        name: 'Ship',
        speed: 100,
        currentPosition: expectedPosition,
        destinationPosition: expectedDestination,
      });
      expect(prisma.ship.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { owner: true },
      });
      expect(ship).toStrictEqual(expectedShip);
    });
  });

  describe('update', () => {
    describe('when ship is stationary', () => {
      test('it updates the ships', async () => {
        // given
        const ship = ModelFactory.createShip({
          id: 1,
          name: 'Ship',
          currentPosition: new Position(1, 2),
        });
        const prisma = {
          ship: {
            update: jest.fn(),
          },
        } as unknown as PrismaClient;
        const repository = new ShipRepository(prisma);
        jest.useFakeTimers().setSystemTime(new Date('2019-01-01'));

        // when
        await repository.update(ship);

        // then
        expect(prisma.ship.update).toHaveBeenCalledWith({
          where: {
            id: ship.id,
          },
          data: {
            currentPositionX: ship.currentPosition.x,
            currentPositionY: ship.currentPosition.y,
            destinationPositionX: null,
            destinationPositionY: null,
            updatedAt: new Date('2019-01-01'),
          },
        });
      });
    });

    describe('when ship has a destination', () => {
      test('it updates the ships and destination', async () => {
        // given
        const currentPosition = new Position(1, 3);
        const destinationPosition = new Position(1, 2);
        const ship = ModelFactory.createShip({
          id: 1,
          name: 'Ship',
          currentPosition,
          destinationPosition,
        });
        const prisma = {
          ship: {
            update: jest.fn(),
          },
        } as unknown as PrismaClient;
        const repository = new ShipRepository(prisma);
        jest.useFakeTimers().setSystemTime(new Date('2019-01-01'));

        // when
        await repository.update(ship);

        // then
        expect(prisma.ship.update).toHaveBeenCalledWith({
          where: {
            id: ship.id,
          },
          data: {
            currentPositionX: ship.currentPosition.x,
            currentPositionY: ship.currentPosition.y,
            destinationPositionX: ship.destinationPosition.x,
            destinationPositionY: ship.destinationPosition.y,
            updatedAt: new Date('2019-01-01'),
          },
        });
      });
    });
  });
});
