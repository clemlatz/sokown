import ShipRepository from "./ShipRepository";
import {PrismaClient} from "@prisma/client";
import Ship from "../models/Ship";
import Position from "../models/Position";

describe("ShipRepository", () => {
  describe("getAll", () => {
    test("it gets all the ships", async () => {
      // given
      const givenShips = [{ id: 1, name: 'Ship', currentPositionX: 1, currentPositionY: 2 }];
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
      const expectedShip = new Ship(1, "Ship", expectedPosition);
      expect(prisma.ship.findMany).toHaveBeenCalled();
      expect(ships[0]).toStrictEqual(expectedShip);
    });
  });

  describe("update", () => {
    test("it updates the ships", async () => {
      // given
      const ship = new Ship(1, "Ship", new Position(1, 2));
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
        },
      });
    })
  });
});
