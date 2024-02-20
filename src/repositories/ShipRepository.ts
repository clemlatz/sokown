import Ship from "../models/Ship";
import {PrismaClient} from "@prisma/client";
import Position from "../models/Position";

export default class ShipRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(): Promise<Ship[]> {
    const ships = await this.prisma.ship.findMany();
    return ships.map(ship => {
      const currentPosition = new Position(ship.currentPositionX, ship.currentPositionY)
      return new Ship(ship.id,ship.name || "Unnamed ship", currentPosition);
    });
  }

  async update(ship: Ship): Promise<void> {
    await this.prisma.ship.update({
      where: {
        id: ship.id,
      },
      data: {
        currentPositionX: ship.currentPosition.x,
        currentPositionY: ship.currentPosition.y,
      },
    });
  }
}
