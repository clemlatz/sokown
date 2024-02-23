import ShipRepository from './ShipRepository';
import { PrismaClient } from '@prisma/client';
import Ship from '../models/Ship';
import Position from '../models/Position';

describe('ShipRepository', () => {
  describe('getAll', () => {
    test('it gets all the ships', async () => {
      // given
      const givenShips = [
        {
          id: 1,
          name: 'Ship',
          currentPositionX: 1,
          currentPositionY: 2,
          destinationPositionX: null,
          destinationPositionY: null,
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
      const expectedPosition = new Position(1, 2);
      const expectedShip = new Ship(1, 'Ship', expectedPosition, null);
      expect(prisma.ship.findMany).toHaveBeenCalledWith();
      expect(ships[0]).toStrictEqual(expectedShip);
    });
  });

  describe('getShipsWithDestination', () => {
    test('it gets all the ships with a destination set', async () => {
      // given
      const givenShips = [
        {
          id: 1,
          name: 'Ship',
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
      const expectedShip = new Ship(
        1,
        'Ship',
        expectedPosition,
        expectedDestination,
      );
      expect(prisma.ship.findMany).toHaveBeenCalledWith({
        where: {
          destinationPositionX: { not: null },
          destinationPositionY: { not: null },
        },
      });
      expect(ships[0]).toStrictEqual(expectedShip);
    });
  });

  describe('getById', () => {
    test('it returns ship for given id', async () => {
      // given
      const givenShip = {
        id: 1,
        name: 'Ship',
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
      const expectedShip = new Ship(
        1,
        'Ship',
        expectedPosition,
        expectedDestination,
      );
      expect(prisma.ship.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
      expect(ship).toStrictEqual(expectedShip);
    });
  });

  describe('update', () => {
    describe('when ship is stationary', () => {
      test('it updates the ships', async () => {
        // given
        const ship = new Ship(1, 'Ship', new Position(1, 2), null);
        const prisma = {
          ship: {
            update: jest.fn(),
          },
        } as unknown as PrismaClient;
        const repository = new ShipRepository(prisma);

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
          },
        });
      });
    });

    describe('when ship has a destination', () => {
      test('it updates the ships and destination', async () => {
        // given
        const currentPosition = new Position(1, 3);
        const destinationPosition = new Position(1, 2);
        const ship = new Ship(1, 'Ship', currentPosition, destinationPosition);
        const prisma = {
          ship: {
            update: jest.fn(),
          },
        } as unknown as PrismaClient;
        const repository = new ShipRepository(prisma);

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
          },
        });
      });
    });
  });
});
