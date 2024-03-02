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

  async create(provider: string, externalId: string) {
    const authenticationMethod = await this.prisma.authenticationMethod.create({
      data: {
        provider,
        externalId,
        userId: null,
      },
    });
    return new AuthenticationMethod(
      authenticationMethod.id,
      authenticationMethod.externalId,
    );
  }

  async existsById(id: number): Promise<AuthenticationMethod> {
    const authenticationMethod =
      await this.prisma.authenticationMethod.findUnique({
        where: { id },
        include: { user: true },
      });

    if (authenticationMethod === null) {
      return null;
    }

    return _buildAuthenticationMethod(authenticationMethod);
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

    return _buildAuthenticationMethod(authenticationMethod);
  }
}

export type AuthenticationMethodDTO = {
  id: number;
  externalId: string;
  user: {
    id: number;
    pilotName: string;
  };
};

function _buildAuthenticationMethod(
  authenticationMethod: AuthenticationMethodDTO,
) {
  const { user } = authenticationMethod;
  return new AuthenticationMethod(
    authenticationMethod.id,
    authenticationMethod.externalId,
    user === null ? null : new User(user.id, user.pilotName),
  );
}
