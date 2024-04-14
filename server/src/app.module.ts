import { Module } from '@nestjs/common';
import { CookieSessionModule } from 'nestjs-cookie-session';
import { PrismaClient } from '@prisma/client';
import * as process from 'process';

import AuthenticationMethodController from './controllers/AuthenticationMethodController';
import OpenIDConnectController from './controllers/OpenIDConnectController';
import { ShipController } from './controllers/ShipController';
import UserController from './controllers/UserController';

import RegisterNewPilotUsecase from './usescases/RegisterNewPilotUsecase';

import AuthenticationGuard from './guards/AuthenticationGuard';
import OpenIDConnectService from './services/OpenIDConnectService';

import AuthenticationMethodRepository from './repositories/AuthenticationMethodRepository';
import EventRepository from './repositories/EventRepository';
import LocationRepository from './repositories/LocationRepository';
import ShipRepository from './repositories/ShipRepository';
import UserRepository from './repositories/UserRepository';
import LocationController from './controllers/LocationController';

@Module({
  imports: [
    CookieSessionModule.forRoot({
      session: { secret: process.env.COOKIE_SECRET },
    }),
  ],
  controllers: [
    ShipController,
    OpenIDConnectController,
    UserController,
    AuthenticationMethodController,
    LocationController,
  ],
  providers: [
    PrismaClient,
    ShipRepository,
    LocationRepository,
    EventRepository,
    AuthenticationMethodRepository,
    UserRepository,
    OpenIDConnectService.factory,
    AuthenticationGuard,
    RegisterNewPilotUsecase,
  ],
})
export class AppModule {}
