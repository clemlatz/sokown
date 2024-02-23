import { Module } from '@nestjs/common';
import { ShipController } from './controllers/ShipController';
import ShipRepository from './repositories/ShipRepository';
import { PrismaClient } from '@prisma/client';
import LocationRepository from './repositories/LocationRepository';

@Module({
  imports: [],
  controllers: [ShipController],
  providers: [PrismaClient, ShipRepository, LocationRepository],
})
export class AppModule {}
