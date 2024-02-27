import { PrismaClient } from '@prisma/client';

import AuthenticationMethodRepository from './AuthenticationMethodRepository';
import AuthenticationMethod from '../models/AuthenticationMethod';
import User from '../models/User';

describe('AuthenticationMethodRepository', () => {
  describe('findByProviderAndExternalId', () => {
    it('returns authentication method if it exists for given external id', async () => {
      // given
      const givenAuthenticationMethod = {
        id: 1,
        externalId: 'external-id',
        user: {
          id: 2,
          pilotName: 'Chuck Yeager',
        },
      };
      const prisma = {
        authenticationMethod: {
          findFirst: jest.fn().mockResolvedValue(givenAuthenticationMethod),
        },
      } as unknown as PrismaClient;
      const repository = new AuthenticationMethodRepository(prisma);

      // when
      const authenticationMethod = await repository.findByProviderAndExternalId(
        'axys',
        'external-id',
      );

      // then
      const expectedAuthenticationMethod = new AuthenticationMethod(
        1,
        'external-id',
        new User(2, 'Chuck Yeager'),
      );
      expect(authenticationMethod).toEqual(expectedAuthenticationMethod);
      expect(prisma.authenticationMethod.findFirst).toHaveBeenCalledWith({
        where: {
          provider: 'axys',
          externalId: 'external-id',
        },
        include: {
          user: true,
        },
      });
    });

    it('returns authentication method if it does not exist for given external id', async () => {
      // given
      const prisma = {
        authenticationMethod: {
          findFirst: jest.fn().mockResolvedValue(null),
        },
      } as unknown as PrismaClient;
      const repository = new AuthenticationMethodRepository(prisma);

      // when
      const authenticationMethod = await repository.findByProviderAndExternalId(
        'axys',
        'unknown external-id',
      );

      // then
      expect(authenticationMethod).toBeNull();
    });
  });
});
