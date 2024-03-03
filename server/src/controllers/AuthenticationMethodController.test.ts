import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

import AuthenticationMethodRepository from '../repositories/AuthenticationMethodRepository';
import SessionToken from '../models/SessionToken';
import AuthenticationMethodController from './AuthenticationMethodController';
import AuthenticationMethod from '../models/AuthenticationMethod';

describe('AuthenticationMethod', () => {
  let authenticationMethodController: AuthenticationMethodController;
  let authenticationMethodRepository: AuthenticationMethodRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationMethodController],
      providers: [PrismaClient, AuthenticationMethodRepository],
    }).compile();

    authenticationMethodController = app.get<AuthenticationMethodController>(
      AuthenticationMethodController,
    );
    authenticationMethodRepository = app.get<AuthenticationMethodRepository>(
      AuthenticationMethodRepository,
    );
  });

  describe('current', () => {
    it('it returns current authentication method', async () => {
      // given
      const session = new SessionToken({ sub: 1 });
      const response = {
        json: jest.fn(),
      } as unknown as Response;
      const authMethod = new AuthenticationMethod(
        1,
        {
          email: 'user@example.net',
          username: 'name',
        },
        null,
      );
      jest
        .spyOn(authenticationMethodRepository, 'getById')
        .mockImplementation(async () => authMethod);

      // when
      await authenticationMethodController.current(session, response);

      // then
      expect(response.json).toHaveBeenCalledWith({
        data: {
          id: 'current',
          type: 'authenticationMethod',
          attributes: {
            idTokenClaims: {
              email: 'user@example.net',
              username: 'name',
            },
          },
        },
      });
    });
  });
});
