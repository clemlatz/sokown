import { PrismaClient } from '@prisma/client';

import AuthenticationMethodRepository from './AuthenticationMethodRepository';
import AuthenticationMethod from '../models/AuthenticationMethod';
import User from '../models/User';

describe('AuthenticationMethodRepository', () => {
  describe('create', () => {
    it('creates and returns new authentication method', async () => {
      // given
      const prisma = {
        authenticationMethod: {
          create: jest
            .fn()
            .mockResolvedValue({ id: 1, externalId: 'external-id' }),
        },
      } as unknown as PrismaClient;
      const repository = new AuthenticationMethodRepository(prisma);

      // when
      const authenticationMethod = await repository.create(
        'axys',
        'external-id',
      );

      // then
      expect(prisma.authenticationMethod.create).toHaveBeenCalledWith({
        data: {
          provider: 'axys',
          externalId: 'external-id',
          userId: null,
        },
      });
      expect(authenticationMethod).toEqual(
        new AuthenticationMethod(1, 'external-id'),
      );
    });
  });

  describe('existsById', () => {
    describe('when authentication method exists for given id', () => {
      it('returns true', async () => {
        // given
        const prisma = {
          authenticationMethod: {
            findUnique: jest.fn().mockResolvedValue({}),
          },
        } as unknown as PrismaClient;
        const repository = new AuthenticationMethodRepository(prisma);

        // when
        const exists = await repository.existsById(1);

        // then
        expect(exists).toBe(true);
        expect(prisma.authenticationMethod.findUnique).toHaveBeenCalledWith({
          where: { id: 1 },
        });
      });
    });

    describe('when authentication method does not exist for given id', () => {
      it('returns false', async () => {
        // given
        const prisma = {
          authenticationMethod: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
        } as unknown as PrismaClient;
        const repository = new AuthenticationMethodRepository(prisma);

        // when
        const exists = await repository.existsById(1);

        // then
        expect(exists).toBe(false);
        expect(prisma.authenticationMethod.findUnique).toHaveBeenCalledWith({
          where: { id: 1 },
        });
      });
    });
  });

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
