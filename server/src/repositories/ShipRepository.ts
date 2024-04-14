import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import Position from '../models/Position';
import Ship from '../models/Ship';
import SpeedInKilometersPerSecond from '../values/SpeedInKilometersPerSecond';
import User from '../models/User';
import { ITXClientDenyList } from 'prisma/prisma-client/runtime/library';

export type ShipDTO = {
  id: number;
  owner: {
    id: number;
    pilotName: string;
  };
  name: string;
  speed: number;
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

  async create(
    transaction: Omit<PrismaClient, ITXClientDenyList>,
    name: string,
    speed: number,
    currentPositionX: number,
    currentPositionY: number,
    owner: User,
  ): Promise<void> {
    await transaction.ship.create({
      data: {
        name,
        speed,
        currentPositionX,
        currentPositionY,
        ownerId: owner.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async existsForName(name: string): Promise<boolean> {
    const ship = await this.prisma.ship.findFirst({
      where: { name },
    });

    return ship !== null;
  }

  async getAll() {
    const ships = await this.prisma.ship.findMany({
      include: {
        owner: true,
      },
    });
    return ships.map((ship) => ShipRepository.buildShipModel(ship));
  }

  async getShipsWithDestination(): Promise<Ship[]> {
    const ships = await this.prisma.ship.findMany({
      where: {
        destinationPositionX: { not: null },
        destinationPositionY: { not: null },
      },
      include: {
        owner: true,
      },
    });
    return ships.map((ship) => ShipRepository.buildShipModel(ship));
  }

  async getById(id: number) {
    const ship = await this.prisma.ship.findFirst({
      where: { id },
      include: { owner: true },
    });

    return ShipRepository.buildShipModel(ship);
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
        updatedAt: new Date(),
      },
    });
  }

  private static buildShipModel(ship: ShipDTO) {
    const destination =
      ship.destinationPositionX !== null && ship.destinationPositionY !== null
        ? new Position(ship.destinationPositionX, ship.destinationPositionY)
        : null;
    const currentPosition = new Position(
      ship.currentPositionX,
      ship.currentPositionY,
    );

    const owner = new User(ship.owner.id, ship.owner.pilotName);
    return new Ship(
      ship.id,
      owner,
      ship.name || 'Unnamed ship',
      new SpeedInKilometersPerSecond(ship.speed),
      currentPosition,
      destination,
    );
  }
}
