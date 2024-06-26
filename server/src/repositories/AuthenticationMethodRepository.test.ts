import { PrismaClient } from '@prisma/client';

import AuthenticationMethodRepository from './AuthenticationMethodRepository';
import AuthenticationMethod from '../models/AuthenticationMethod';
import User from '../models/User';
import { UnknownAuthenticationMethodError } from '../errors/UnknownAuthenticationMethodError';
import ModelFactory from '../../test/ModelFactory';

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
        { email: 'user@example.net', username: 'name' },
      );

      // then
      expect(prisma.authenticationMethod.create).toHaveBeenCalledWith({
        data: {
          provider: 'axys',
          externalId: 'external-id',
          idTokenClaims: {
            email: 'user@example.net',
            username: 'name',
          },
          userId: null,
        },
      });
      expect(authenticationMethod).toEqual(
        new AuthenticationMethod(1, {
          email: 'user@example.net',
          username: 'name',
        }),
      );
    });
  });

  describe('findById', () => {
    describe('when authentication method exists for given id', () => {
      it('returns authentication method', async () => {
        // given
        const prisma = {
          authenticationMethod: {
            findUnique: jest.fn().mockResolvedValue({
              id: 1,
              externalId: 'external-id',
              idTokenClaims: {
                email: 'user@example.net',
                username: 'name',
              },
              user: {
                id: 2,
                pilotName: 'Chuck Yeager',
              },
            }),
          },
        } as unknown as PrismaClient;
        const repository = new AuthenticationMethodRepository(prisma);

        // when
        const authMethod = await repository.findById(1);

        // then
        expect(authMethod).toStrictEqual(
          new AuthenticationMethod(
            1,
            {
              email: 'user@example.net',
              username: 'name',
            },
            new User(2, 'Chuck Yeager'),
          ),
        );
        expect(prisma.authenticationMethod.findUnique).toHaveBeenCalledWith({
          where: { id: 1 },
          include: { user: true },
        });
      });
    });

    describe('when authentication method exists but without user', () => {
      it('returns authentication method without user', async () => {
        // given
        const prisma = {
          authenticationMethod: {
            findUnique: jest.fn().mockResolvedValue({
              id: 1,
              externalId: 'external-id',
              idTokenClaims: {
                email: 'user@example.net',
                username: 'name',
              },
              user: null,
            }),
          },
        } as unknown as PrismaClient;
        const repository = new AuthenticationMethodRepository(prisma);

        // when
        const authMethod = await repository.findById(1);

        // then
        expect(authMethod).toStrictEqual(
          new AuthenticationMethod(1, {
            email: 'user@example.net',
            username: 'name',
          }),
        );
        expect(prisma.authenticationMethod.findUnique).toHaveBeenCalledWith({
          where: { id: 1 },
          include: { user: true },
        });
      });
    });

    describe('when authentication method does not exist for given id', () => {
      it('returns null', async () => {
        // given
        const prisma = {
          authenticationMethod: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
        } as unknown as PrismaClient;
        const repository = new AuthenticationMethodRepository(prisma);

        // when
        const authMethod = await repository.findById(1);

        // then
        expect(authMethod).toBe(null);
      });
    });
  });

  describe('getById', () => {
    describe('when authentication method exists for given id', () => {
      it('returns authentication method', async () => {
        // given
        const prisma = {
          authenticationMethod: {
            findUnique: jest.fn().mockResolvedValue({
              id: 1,
              externalId: 'external-id',
              idTokenClaims: {
                email: 'user@example.net',
                username: 'name',
              },
              user: {
                id: 2,
                pilotName: 'Chuck Yeager',
              },
            }),
          },
        } as unknown as PrismaClient;
        const repository = new AuthenticationMethodRepository(prisma);

        // when
        const authMethod = await repository.getById(1);

        // then
        expect(authMethod).toStrictEqual(
          new AuthenticationMethod(
            1,
            {
              email: 'user@example.net',
              username: 'name',
            },
            new User(2, 'Chuck Yeager'),
          ),
        );
        expect(prisma.authenticationMethod.findUnique).toHaveBeenCalledWith({
          where: { id: 1 },
          include: { user: true },
        });
      });
    });

    describe('when authentication method does not exist for given id', () => {
      it('throws UnknownAuthenticationMethodError', async () => {
        // given
        const prisma = {
          authenticationMethod: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
        } as unknown as PrismaClient;
        const repository = new AuthenticationMethodRepository(prisma);

        // when
        const tested = async () => await repository.getById(1);

        // then
        const expectedError = new UnknownAuthenticationMethodError(
          'Authentication method not found for id 1',
        );
        await expect(tested).rejects.toEqual(expectedError);
      });
    });
  });

  describe('findByProviderAndExternalId', () => {
    it('returns authentication method if it exists for given external id', async () => {
      // given
      const givenAuthenticationMethod = {
        id: 1,
        externalId: 'external-id',
        idTokenClaims: {
          email: 'user@example.net',
          username: 'name',
        },
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
        {
          email: 'user@example.net',
          username: 'name',
        },
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

  describe('update', () => {
    test('it updates the authentication method', async () => {
      // given
      const authenticationMethod = ModelFactory.createAuthenticationMethod({
        user: null,
      });
      const user = new User(1, 'Svetlana Savitskaïa');
      const prisma = {
        authenticationMethod: {
          update: jest.fn(),
        },
      } as unknown as PrismaClient;
      const repository = new AuthenticationMethodRepository(prisma);
      jest.useFakeTimers().setSystemTime(new Date('2019-01-01'));

      // when
      authenticationMethod.user = user;
      await repository.update(authenticationMethod);

      // then
      expect(prisma.authenticationMethod.update).toHaveBeenCalledWith({
        where: {
          id: authenticationMethod.id,
        },
        data: {
          userId: 1,
          updatedAt: new Date('2019-01-01'),
        },
      });
    });

    test('it updates the authentication method within a transaction', async () => {
      // given
      const authenticationMethod = ModelFactory.createAuthenticationMethod({
        user: null,
      });
      const user = new User(1, 'Svetlana Savitskaïa');
      const prisma = {} as unknown as PrismaClient;
      const transaction = {
        authenticationMethod: {
          update: jest.fn(),
        },
      } as unknown as PrismaClient;
      const repository = new AuthenticationMethodRepository(prisma);
      jest.useFakeTimers().setSystemTime(new Date('2019-01-01'));

      // when
      authenticationMethod.user = user;
      await repository.update(authenticationMethod, transaction);

      // then
      expect(transaction.authenticationMethod.update).toHaveBeenCalledWith({
        where: {
          id: authenticationMethod.id,
        },
        data: {
          userId: 1,
          updatedAt: new Date('2019-01-01'),
        },
      });
    });
  });
});
