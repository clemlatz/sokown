import { PrismaClient } from '@prisma/client';

import User from '../models/User';
import UserRepository from './UserRepository';
import { UnknownAuthenticationMethodError } from '../errors/UnknownAuthenticationMethodError';

describe('UserRepository', () => {
  describe('getById', () => {
    describe('when user exists for given auth method id', () => {
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

    describe('when user does not exist for given auth method id', () => {
      it('throws an Error', async () => {
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
  });
});
