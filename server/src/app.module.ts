import { Module } from '@nestjs/common';

import { ShipController } from './controllers/ShipController';

import { PrismaClient } from '@prisma/client';
import ShipRepository from './repositories/ShipRepository';
import LocationRepository from './repositories/LocationRepository';
import EventRepository from './repositories/EventRepository';
import AuthenticationMethodRepository from './repositories/AuthenticationMethodRepository';
import OpenIDConnectService from './services/OpenIDConnectService';
import { CookieSessionModule } from 'nestjs-cookie-session';
import * as process from 'process';

@Module({
  imports: [],
  controllers: [ShipController],
  providers: [
    PrismaClient,
    ShipRepository,
    LocationRepository,
    EventRepository,
    AuthenticationMethodRepository,
    OpenIDConnectService.factory,
  ],
})
export class AppModule {}
