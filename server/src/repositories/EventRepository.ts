import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import Ship from '../models/Ship';
import Location from '../models/Location';

@Injectable()
export default class EventRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(message: string, ship: Ship, location: Location | null) {
    await this.prisma.event.create({
      data: {
        shipId: ship.id,
        locationCode: location?.code,
        message: message,
        loggedAt: new Date(),
      },
    });
  }
}
