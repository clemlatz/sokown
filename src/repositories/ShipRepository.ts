import { PrismaClient } from '@prisma/client';

import Position from '../models/Position';
import Ship from '../models/Ship';
import LocationRepository from './LocationRepository';

export default class ShipRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getShipsWithDestination(): Promise<Ship[]> {
    const locationRepository = new LocationRepository();
    const ships = await this.prisma.ship.findMany({
      where: {
        destinationCode: { not: null },
      },
    });
    return ships.map((ship) => {
      const destination = ship.destinationCode
        ? locationRepository.getByCode(ship.destinationCode)
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
        destinationCode: ship.isStationary ? null : ship.destination.code,
      },
    });
  }
}
