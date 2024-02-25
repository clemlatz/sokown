import { Module } from '@nestjs/common';

import { ShipController } from './controllers/ShipController';
import OpenIDConnectController from './controllers/OpenIDConnectController';

import { PrismaClient } from '@prisma/client';
import ShipRepository from './repositories/ShipRepository';
import LocationRepository from './repositories/LocationRepository';
import EventRepository from './repositories/EventRepository';
import AuthenticationMethodRepository from './repositories/AuthenticationMethodRepository';
import OpenIDConnectService from './services/OpenIDConnectService';
import { CookieSessionModule } from 'nestjs-cookie-session';
import * as process from 'process';

@Module({
  imports: [
    CookieSessionModule.forRoot({
      session: { secret: process.env.COOKIE_SECRET },
    }),
  ],
  controllers: [ShipController, OpenIDConnectController],
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
