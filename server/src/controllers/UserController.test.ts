import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

import UserController from './UserController';
import User from '../models/User';
import UserRepository from '../repositories/UserRepository';
import { CookieSession } from '../types';
import AuthenticationGuard from '../guards/AuthenticationGuard';
import AuthenticationMethodRepository from '../repositories/AuthenticationMethodRepository';

describe('UserController', () => {
  let userController: UserController;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        PrismaClient,
        UserRepository,
        AuthenticationMethodRepository,
        AuthenticationGuard,
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
    userRepository = app.get<UserRepository>(UserRepository);
  });

  describe('me', () => {
    it('it returns current user', async () => {
      // given
      const session: CookieSession = {
        authenticationMethodId: 1,
      };
      const response = {
        json: jest.fn(),
      } as unknown as Response;
      const user = new User(2, 'Amelia Earhart');
      jest
        .spyOn(userRepository, 'getByAuthenticationMethodId')
        .mockImplementation(async () => user);

      // when
      await userController.me(session, response);

      // then
      expect(response.json).toHaveBeenCalledWith({
        data: {
          id: 'me',
          type: 'user',
          attributes: {
            pilotName: 'Amelia Earhart',
          },
        },
      });
    });
  });
});
