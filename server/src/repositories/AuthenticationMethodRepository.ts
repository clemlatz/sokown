import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import AuthenticationMethod from '../models/AuthenticationMethod';
import User from '../models/User';

@Injectable()
export default class AuthenticationMethodRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async existsById(id: number): Promise<boolean> {
    const method = await this.prisma.authenticationMethod.findUnique({
      where: { id },
    });
    return !!method;
  }

  async findByProviderAndExternalId(provider: string, externalId: string) {
    const authenticationMethod =
      await this.prisma.authenticationMethod.findFirst({
        where: {
          externalId,
          provider,
        },
        include: {
          user: true,
        },
      });

    if (authenticationMethod === null) {
      return null;
    }

    const { user } = authenticationMethod;
    return new AuthenticationMethod(
      authenticationMethod.id,
      authenticationMethod.externalId,
      new User(user.id, user.pilotName),
    );
  }
}
