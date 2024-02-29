import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import User from '../models/User';
import { UnknownAuthenticationMethodError } from '../errors/UnknownAuthenticationMethodError';

@Injectable()
export default class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
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

    const { user } = authenticationMethod;
    return new User(user.id, user.pilotName);
  }
}
