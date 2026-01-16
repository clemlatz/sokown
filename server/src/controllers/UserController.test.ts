import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

import UserController from './UserController';
import User from '../models/User';
import UserRepository from '../repositories/UserRepository';
import AuthenticationGuard from '../guards/AuthenticationGuard';
import AuthenticationMethodRepository from '../repositories/AuthenticationMethodRepository';
import SessionToken from '../models/SessionToken';
import RegisterNewPilotUsecase from '../usescases/RegisterNewPilotUsecase';
import ModelFactory from '../../test/ModelFactory';
import ShipRepository from '../repositories/ShipRepository';
import LocationRepository from '../repositories/LocationRepository';
import { InvalidParametersError } from '../errors/InvalidParametersError';
import { JsonApiError } from '../errors/JsonApiError';

describe('UserController', () => {
  let userController: UserController;
  let registerNewPilotUsecase: RegisterNewPilotUsecase;
  let authenticationMethodRepository: AuthenticationMethodRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        PrismaClient,
        UserRepository,
        ShipRepository,
        LocationRepository,
        AuthenticationMethodRepository,
        AuthenticationGuard,
        RegisterNewPilotUsecase,
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
    registerNewPilotUsecase = app.get<RegisterNewPilotUsecase>(
      RegisterNewPilotUsecase,
    );
    authenticationMethodRepository = app.get<AuthenticationMethodRepository>(
      AuthenticationMethodRepository,
    );
    userRepository = app.get<UserRepository>(UserRepository);
  });

  describe('create', () => {
    describe('when pilot name is already taken', () => {
      it('returns an error with status 409', async () => {
        // given
        const session = new SessionToken({ sub: 1 });
        const authenticationMethod = ModelFactory.createAuthenticationMethod({
          id: 1,
          idTokenClaims: {
            username: 'Sally Ride',
            email: 'sally@example.net',
          },
        });
        jest
          .spyOn(authenticationMethodRepository, 'getById')
          .mockResolvedValue(authenticationMethod);
        jest
          .spyOn(registerNewPilotUsecase, 'execute')
          .mockRejectedValue(
            new InvalidParametersError('This pilot name is already taken'),
          );
        const response = {
          send: jest.fn(),
        } as unknown as Response;
        const payload = {
          data: {
            attributes: {
              pilotName: 'Sally Ride',
              hasEnabledNotifications: true,
              shipName: 'STS-7 Challenger',
            },
          },
        };

        // when
        const promise = userController.create(session, payload, response);

        // then
        await expect(promise).rejects.toStrictEqual(
          new JsonApiError(400, 'This pilot name is already taken'),
        );
      });
    });

    describe('success case', () => {
      it('it registers a new pilot', async () => {
        // given
        const session = new SessionToken({ sub: 1 });
        const authenticationMethod = ModelFactory.createAuthenticationMethod({
          id: 1,
          idTokenClaims: {
            username: '',
            email: 'sally@example.net',
          },
        });
        jest
          .spyOn(authenticationMethodRepository, 'getById')
          .mockResolvedValue(authenticationMethod);
        jest.spyOn(registerNewPilotUsecase, 'execute').mockResolvedValue();
        const response = {
          send: jest.fn(),
        } as unknown as Response;
        const payload = {
          data: {
            attributes: {
              pilotName: 'Sally Ride',
              hasEnabledNotifications: true,
              shipName: 'STS-7 Challenger',
            },
          },
        };

        // when
        await userController.create(session, payload, response);

        // then
        expect(registerNewPilotUsecase.execute).toHaveBeenCalledWith(
          1,
          'Sally Ride',
          true,
          'STS-7 Challenger',
        );
        expect(response.send).toHaveBeenCalledWith({
          data: {
            id: 'me',
            type: 'user',
            attributes: {
              pilotName: 'Sally Ride',
            },
          },
        });
      });
    });
  });

  describe('me', () => {
    it('it returns current user', async () => {
      // given
      const session = new SessionToken({ sub: 1 });
      const response = {
        json: jest.fn(),
      } as unknown as Response;
      const user = new User(2, 'Amelia Earhart', 'amelia@example.com', false);
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
