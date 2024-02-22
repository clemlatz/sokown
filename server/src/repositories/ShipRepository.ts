import { PrismaClient } from '@prisma/client';

import Position from '../models/Position';
import Ship from '../models/Ship';
import { Injectable } from '@nestjs/common';

type ShipDTO = {
  id: number;
  name: string;
  currentPositionX: number;
  currentPositionY: number;
  destinationPositionX: number;
  destinationPositionY: number;
};

@Injectable()
export default class ShipRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll() {
    const ships = await this.prisma.ship.findMany();
    return ships.map((ship) => ShipRepository.buildShipModel(ship));
  }

  async getShipsWithDestination(): Promise<Ship[]> {
    const ships = await this.prisma.ship.findMany({
      where: {
        destinationPositionX: { not: null },
        destinationPositionY: { not: null },
      },
    });
    return ships.map((ship) => ShipRepository.buildShipModel(ship));
  }

  async update(ship: Ship): Promise<void> {
    await this.prisma.ship.update({
      where: {
        id: ship.id,
      },
      data: {
        currentPositionX: ship.currentPosition.x,
        currentPositionY: ship.currentPosition.y,
        destinationPositionX: ship.isStationary
          ? null
          : ship.destinationPosition.x,
        destinationPositionY: ship.isStationary
          ? null
          : ship.destinationPosition.y,
      },
    });
  }

  private static buildShipModel(ship: ShipDTO) {
    const destination =
      ship.destinationPositionX && ship.destinationPositionY
        ? new Position(ship.destinationPositionX, ship.destinationPositionY)
        : null;
    const currentPosition = new Position(
      ship.currentPositionX,
      ship.currentPositionY,
    );
    return new Ship(
      ship.id,
      ship.name || 'Unnamed ship',
      currentPosition,
      destination,
    );
  }
}