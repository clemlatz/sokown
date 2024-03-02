import { PrismaClient } from '@prisma/client';

import User from '../models/User';
import UserRepository from './UserRepository';
import { UnknownAuthenticationMethodError } from '../errors/UnknownAuthenticationMethodError';

describe('UserRepository', () => {
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
              },
            }),
          },
        } as unknown as PrismaClient;
        const repository = new UserRepository(prisma);

        // when
        const user = await repository.getByAuthenticationMethodId(1);

        // then
        const expectedUser = new User(2, 'Charles Lindbergh');
        expect(user).toEqual(expectedUser);
        expect(prisma.authenticationMethod.findUnique).toHaveBeenCalledWith({
          where: { id: 1 },
          include: { user: true },
        });
      });
    });
  });
});
