import { Module } from '@nestjs/common';
import { ShipController } from './controllers/ShipController';
import ShipRepository from './repositories/ShipRepository';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [],
  controllers: [ShipController],
  providers: [PrismaClient, ShipRepository],
})
export class AppModule {}
