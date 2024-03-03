import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import AuthenticationMethod, {
  AxysIdTokenClaims,
} from '../models/AuthenticationMethod';
import User from '../models/User';

@Injectable()
export default class AuthenticationMethodRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(
    provider: string,
    externalId: string,
    idTokenClaims: AxysIdTokenClaims,
  ) {
    const authenticationMethod = await this.prisma.authenticationMethod.create({
      data: {
        provider,
        externalId,
        userId: null,
        idTokenClaims,
      },
    });
    return new AuthenticationMethod(authenticationMethod.id, idTokenClaims);
  }

  async findById(id: number): Promise<AuthenticationMethod> {
    const authenticationMethod =
      (await this.prisma.authenticationMethod.findUnique({
        where: { id },
        include: { user: true },
      })) as unknown as AuthenticationMethodDTO;

    if (authenticationMethod === null) {
      return null;
    }

    return _buildAuthenticationMethod(authenticationMethod);
  }

  async getById(id: number): Promise<AuthenticationMethod> {
    const authenticationMethod = await this.findById(id);

    if (authenticationMethod === null) {
      throw new Error(`Authentication method not found for id ${id}`);
    }

    return authenticationMethod;
  }

  async findByProviderAndExternalId(provider: string, externalId: string) {
    const authenticationMethod =
      (await this.prisma.authenticationMethod.findFirst({
        where: {
          externalId,
          provider,
        },
        include: {
          user: true,
        },
      })) as unknown as AuthenticationMethodDTO;

    if (authenticationMethod === null) {
      return null;
    }

    return _buildAuthenticationMethod(authenticationMethod);
  }
}

export type AuthenticationMethodDTO = {
  idTokenClaims: AxysIdTokenClaims;
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
    authenticationMethod.idTokenClaims,
    user === null ? null : new User(user.id, user.pilotName),
  );
}
