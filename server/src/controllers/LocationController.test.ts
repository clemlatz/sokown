import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

import LocationController from './LocationController';
import ShipRepository from '../repositories/ShipRepository';
import LocationRepository from '../repositories/LocationRepository';
import EventRepository from '../repositories/EventRepository';
import AuthenticationMethodRepository from '../repositories/AuthenticationMethodRepository';
import AuthenticationGuard from '../guards/AuthenticationGuard';
import Position from '../models/Position';
import Location from '../models/Location';

describe('LocationController', () => {
  let locationController: LocationController;
  let locationRepository: LocationRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        PrismaClient,
        ShipRepository,
        LocationRepository,
        EventRepository,
        AuthenticationGuard,
        AuthenticationMethodRepository,
      ],
    }).compile();

    locationController = app.get<LocationController>(LocationController);
    locationRepository = app.get<LocationRepository>(LocationRepository);
  });

  describe('index', () => {
    it('it returns a list of locations', async () => {
      // given
      const response = {
        json: jest.fn(),
      } as unknown as Response;
      const locations = [
        new Location('earth', 'Earth', new Position(1, 2)),
        new Location('moon', 'Moon', new Position(3, 4)),
      ];
      jest
        .spyOn(locationRepository, 'getAll')
        .mockImplementation(() => locations);

      // when
      await locationController.index(response);

      // then
      expect(response.json).toHaveBeenCalledWith({
        data: [
          {
            id: 'earth',
            type: 'location',
            attributes: {
              name: 'Earth',
              position: { x: 1, y: 2 },
            },
          },
          {
            id: 'moon',
            type: 'location',
            attributes: {
              name: 'Moon',
              position: { x: 3, y: 4 },
            },
          },
        ],
      });
    });
  });
});
