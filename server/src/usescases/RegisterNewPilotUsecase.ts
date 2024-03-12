import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import UserRepository from '../repositories/UserRepository';
import ShipRepository from '../repositories/ShipRepository';
import LocationRepository from '../repositories/LocationRepository';
import AuthenticationMethodRepository from '../repositories/AuthenticationMethodRepository';

@Injectable()
export default class RegisterNewPilotUsecase {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly userRepository: UserRepository,
    private readonly shipRepository: ShipRepository,
    private readonly locationRepository: LocationRepository,
    private readonly authenticationMethodRepository: AuthenticationMethodRepository,
  ) {}

  async execute(
    authenticationMethodId: number,
    pilotName: string,
    hasEnabledNotifications: boolean,
    shipName: string,
  ): Promise<void> {
    const authenticationMethod =
      await this.authenticationMethodRepository.getById(authenticationMethodId);

    await this.prisma.$transaction(async (transaction) => {
      const user = await this.userRepository.create(
        transaction,
        authenticationMethod.idTokenClaims.email,
        pilotName,
        hasEnabledNotifications,
      );

      const moonLocation = this.locationRepository.getByCode('moon');
      const defaultShip = {
        speed: 100,
        currentPositionX: moonLocation.position.x,
        currentPositionY: moonLocation.position.y,
      };

      await this.shipRepository.create(
        transaction,
        shipName,
        defaultShip.speed,
        defaultShip.currentPositionX,
        defaultShip.currentPositionY,
        user,
      );

      authenticationMethod.user = user;
      await this.authenticationMethodRepository.update(
        authenticationMethod,
        transaction,
      );
    });
  }
}
