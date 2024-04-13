import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import User from '../models/User';
import { UnknownAuthenticationMethodError } from '../errors/UnknownAuthenticationMethodError';
import { ITXClientDenyList } from 'prisma/prisma-client/runtime/library';

@Injectable()
export default class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(
    transaction: Omit<PrismaClient, ITXClientDenyList>,
    email: string,
    pilotName: string,
    hasEnabledNotifications: boolean,
  ): Promise<User> {
    const userDto = await transaction.user.create({
      data: {
        email,
        pilotName,
        hasEnabledNotifications,
        lastLoggedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return new User(userDto.id, userDto.pilotName);
  }

  async getByAuthenticationMethodId(id: number): Promise<User> {
    const authenticationMethod =
      await this.prisma.authenticationMethod.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });

    if (authenticationMethod === null) {
      throw new UnknownAuthenticationMethodError(
        'No authentication method found for given id',
      );
    }

    if (authenticationMethod.user === null) {
      throw new UnknownAuthenticationMethodError(
        'No user found for given authentication method id',
      );
    }

    const { user } = authenticationMethod;
    return new User(user.id, user.pilotName);
  }

  async existsByPilotName(pilotName: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { pilotName },
    });

    return user !== null;
  }
}
