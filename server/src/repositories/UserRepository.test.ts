import { PrismaClient } from '@prisma/client';

import User from '../models/User';
import UserRepository from './UserRepository';
import { UnknownAuthenticationMethodError } from '../errors/UnknownAuthenticationMethodError';

describe('UserRepository', () => {
  describe('create', () => {
    test('it creates a new user', async () => {
      // given
      const prisma = {
        user: {
          create: jest.fn().mockResolvedValue({
            id: 1,
            pilotName: 'Valentina Terechkova',
            email: 'valentina@example.org',
            hasEnabledNotifications: false,
          }),
        },
      } as unknown as PrismaClient;
      const repository = new UserRepository(prisma);
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

      // when
      const returnedUser = await repository.create(
        prisma,
        'valentina@example.org',
        'Valentina Terechkova',
        false,
      );

      // then
      const expectedUser = new User(
        1,
        'Valentina Terechkova',
        'valentina@example.org',
        false,
      );
      expect(returnedUser).toEqual(expectedUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'valentina@example.org',
          pilotName: 'Valentina Terechkova',
          hasEnabledNotifications: false,
          lastLoggedAt: new Date('2020-01-01'),
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2020-01-01'),
        },
      });
    });
  });

  describe('getByAuthenticationMethodId', () => {
    describe('when there is no auth method for given id', () => {
      it('throws an UnknownAuthenticationMethodError', async () => {
        // given
        const prisma = {
          authenticationMethod: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
        } as unknown as PrismaClient;
        const repository = new UserRepository(prisma);

        // when
        const promise = repository.getByAuthenticationMethodId(1);

        // then
        const expectedError = new UnknownAuthenticationMethodError(
          'No authentication method found for given id',
        );
        await expect(promise).rejects.toThrow(expectedError);
      });
    });

    describe('when auth method exists for given id but there is no user', () => {
      it('throws an UnknownAuthenticationMethodError', async () => {
        // given
        const prisma = {
          authenticationMethod: {
            findUnique: jest.fn().mockResolvedValue({
              id: 1,
              user: null,
            }),
          },
        } as unknown as PrismaClient;
        const repository = new UserRepository(prisma);

        // when
        const promise = repository.getByAuthenticationMethodId(1);

        // then
        const expectedError = new UnknownAuthenticationMethodError(
          'No user found for given authentication method id',
        );
        await expect(promise).rejects.toThrow(expectedError);
      });
    });

    describe('when user and auth method exists for given id', () => {
      it('returns User', async () => {
        // given
        const prisma = {
          authenticationMethod: {
            findUnique: jest.fn().mockResolvedValue({
              id: 1,
              user: {
                id: 2,
                pilotName: 'Charles Lindbergh',
                email: 'charles@example.com',
                hasEnabledNotifications: true,
              },
            }),
          },
        } as unknown as PrismaClient;
        const repository = new UserRepository(prisma);

        // when
        const user = await repository.getByAuthenticationMethodId(1);

        // then
        const expectedUser = new User(
          2,
          'Charles Lindbergh',
          'charles@example.com',
          true,
        );
        expect(user).toEqual(expectedUser);
        expect(prisma.authenticationMethod.findUnique).toHaveBeenCalledWith({
          where: { id: 1 },
          include: { user: true },
        });
      });
    });
  });

  describe('existsByPilotName', () => {
    it('returns false if user does not exist', async () => {
      // given
      const prisma = {
        user: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      } as unknown as PrismaClient;
      const repository = new UserRepository(prisma);

      // when
      const result = await repository.existsByPilotName('Porco Rosso');

      // then
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          pilotName: 'Porco Rosso',
        },
      });
      expect(result).toBe(false);
    });

    it('returns true if user exists', async () => {
      // given
      const user = new User(
        1,
        'Betty Skelton Erde',
        'betty@example.com',
        false,
      );
      const prisma = {
        user: {
          findUnique: jest.fn().mockResolvedValue(user),
        },
      } as unknown as PrismaClient;
      const repository = new UserRepository(prisma);

      // when
      const result = await repository.existsByPilotName('Betty Skelton Erde');

      // then
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          pilotName: 'Betty Skelton Erde',
        },
      });
      expect(result).toBe(true);
    });
  });
});
