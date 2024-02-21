import ShipRepository from "./ShipRepository";
import {PrismaClient} from "@prisma/client";
import Ship from "../models/Ship";
import Position from "../models/Position";
import Location from "../models/Location";

describe("ShipRepository", () => {
  describe("getShipsWithDestination", () => {
    test("it gets all the ships with a destination set", async () => {
      // given
      const givenShips = [{ id: 1, name: 'Ship', currentPositionX: 1, currentPositionY: 2 }];
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
      const expectedShip = new Ship(1, "Ship", expectedPosition, null);
      expect(prisma.ship.findMany).toHaveBeenCalledWith({
        where: {
          destinationCode: { not: null },
        },
      });
      expect(ships[0]).toStrictEqual(expectedShip);
    });
  });

  describe("update", () => {
    describe("when ship is stationary", () => {
      test("it updates the ships", async () => {
        // given
        const ship = new Ship(1, "Ship", new Position(1, 2), null);
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
            destinationCode: null,
          },
        });
      });
    });

    describe("when ship has a destination", () => {
      test("it updates the ships and destination", async () => {
        // given
        const destinationPosition = new Position(1, 2);
        const destination = new Location("destination", "Destination", destinationPosition);
        const ship = new Ship(1, "Ship", new Position(1, 2), destination);
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
            destinationCode: "destination",
          },
        });
      });
    });
  });
});
