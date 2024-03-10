import RegisterNewPilotUsecase from './RegisterNewPilotUsecase';
import UserRepository from '../repositories/UserRepository';
import ShipRepository from '../repositories/ShipRepository';
import LocationRepository from '../repositories/LocationRepository';
import Location from '../models/Location';
import Position from '../models/Position';
import User from '../models/User';
import { PrismaClient } from '@prisma/client';
import AuthenticationMethodRepository from '../repositories/AuthenticationMethodRepository';
import ModelFactory from '../../test/ModelFactory';

describe('RegisterNewPilotUsecase', () => {
  describe('success case', () => {
    it('should create a new user', async () => {
      // given
      const moonPosition = new Position(1, 2);
      const moonLocation = new Location('moon', 'Moon', moonPosition);
      const createdUser = new User(1, 'Valentina Tereshkova');
      const userRepository = {
        create: jest.fn().mockResolvedValue(createdUser),
      } as unknown as UserRepository;
      const shipRepository = {
        create: jest.fn(),
      } as unknown as ShipRepository;
      const locationRepository = {
        getByCode: jest.fn().mockReturnValue(moonLocation),
      } as unknown as LocationRepository;
      const authenticationMethod = ModelFactory.createAuthenticationMethod({
        id: 1,
        idTokenClaims: {
          username: '',
          email: 'judith@example.net',
        },
        user: null,
      });
      const authenticationMethodRepository = {
        getById: jest.fn().mockResolvedValue(authenticationMethod),
        update: jest.fn(),
      } as unknown as AuthenticationMethodRepository;
      const transaction = jest.fn();
      const prisma = {
        $transaction: jest.fn().mockImplementation((callback) => {
          callback(transaction);
        }),
      } as unknown as PrismaClient;
      const usecase = new RegisterNewPilotUsecase(
        prisma,
        userRepository,
        shipRepository,
        locationRepository,
        authenticationMethodRepository,
      );

      // when
      await usecase.execute(1, 'Judith Resnik', true, 'STS-41-D Discovery');

      // then
      expect(userRepository.create).toHaveBeenCalledWith(
        transaction,
        'judith@example.net',
        'Judith Resnik',
        true,
      );
      expect(locationRepository.getByCode).toHaveBeenCalledWith('moon');
      expect(shipRepository.create).toHaveBeenCalledWith(
        transaction,
        'STS-41-D Discovery',
        100,
        1,
        2,
        createdUser,
      );
      expect(authenticationMethodRepository.getById).toHaveBeenCalledWith(1);
      const updatedAuthenticationMethod =
        ModelFactory.createAuthenticationMethod({
          id: 1,
          idTokenClaims: {
            username: '',
            email: 'judith@example.net',
          },
          user: createdUser,
        });
      expect(authenticationMethodRepository.update).toHaveBeenCalledWith(
        updatedAuthenticationMethod,
        transaction,
      );
    });
  });
});
