import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShipController } from './controllers/ShipController';
import ShipRepository from './repositories/ShipRepository';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [],
  controllers: [AppController, ShipController],
  providers: [AppService, PrismaClient, ShipRepository],
})
export class AppModule {}
