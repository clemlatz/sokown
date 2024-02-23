import { Module } from '@nestjs/common';

import { ShipController } from './controllers/ShipController';

import { PrismaClient } from '@prisma/client';
import ShipRepository from './repositories/ShipRepository';
import LocationRepository from './repositories/LocationRepository';
import EventRepository from './repositories/EventRepository';

@Module({
  imports: [],
  controllers: [ShipController],
  providers: [
    PrismaClient,
    ShipRepository,
    LocationRepository,
    EventRepository,
  ],
})
export class AppModule {}
