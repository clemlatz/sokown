import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

import LocationController from './LocationController';
import LocationRepository from '../repositories/LocationRepository';
import Position from '../models/Position';
import AstronomyService from '../services/AstronomyService';
import ModelFactory from '../../test/ModelFactory';

describe('LocationController', () => {
  let locationController: LocationController;
  let locationRepository: LocationRepository;
  let astronomyService: AstronomyService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [PrismaClient, LocationRepository, AstronomyService],
    }).compile();

    locationController = app.get<LocationController>(LocationController);
    locationRepository = app.get<LocationRepository>(LocationRepository);
    astronomyService = app.get<AstronomyService>(AstronomyService);
    const sun = ModelFactory.createLocation({
      code: 'sun',
      name: 'Sun',
      position: new Position(0, 0),
      primaryBody: null,
      distanceFromPrimaryBody: 0,
    });
    const locations = [
      sun,
      ModelFactory.createLocation({
        code: 'earth',
        name: 'Earth',
        position: new Position(1, 2),
        primaryBody: sun,
        distanceFromPrimaryBody: 1,
      }),
    ];
    jest
      .spyOn(locationRepository, 'getAll')
      .mockImplementation(() => locations);
    jest
      .spyOn(locationRepository, 'getByCode')
      .mockImplementation(() => locations[0]);
    jest
      .spyOn(astronomyService, 'getPositionFor')
      .mockResolvedValue(new Position(5, 6));
  });

  describe('index', () => {
    it('it returns a list of locations', async () => {
      // given
      const response = {
        json: jest.fn(),
      } as unknown as Response;

      // when
      await locationController.index(response);

      // then
      expect(response.json).toHaveBeenCalledWith({
        data: [
          {
            id: 'sun',
            type: 'location',
            attributes: {
              name: 'Sun',
              position: { x: 0, y: 0 },
              primaryBodyPosition: null,
              distanceFromPrimaryBody: 0,
            },
          },
          {
            id: 'earth',
            type: 'location',
            attributes: {
              name: 'Earth',
              position: { x: 1, y: 2 },
              primaryBodyPosition: { x: 0, y: 0 },
              distanceFromPrimaryBody: 1,
            },
          },
        ],
      });
    });
  });

  describe('get', () => {
    describe('when there is a location for given code', () => {
      it('returns a single location', async () => {
        // given
        const response = {
          json: jest.fn(),
        } as unknown as Response;

        // when
        await locationController.get({ code: 'earth' }, response);

        // then
        expect(response.json).toHaveBeenCalledWith({
          data: {
            id: 'sun',
            type: 'location',
            attributes: {
              name: 'Sun',
              position: { x: 0, y: 0 },
              primaryBodyPosition: null,
              distanceFromPrimaryBody: 0,
            },
          },
        });
      });
    });
  });

  describe('getPosition', () => {
    describe('when there is a location for given code', () => {
      it('returns position for location and date', async () => {
        // given
        const response = {
          json: jest.fn(),
        } as unknown as Response;

        // when
        await locationController.getPosition(
          { code: 'earth' },
          { targetDate: '1556412148000' },
          response,
        );

        // then
        expect(astronomyService.getPositionFor).toHaveBeenCalledWith(
          'earth',
          new Date(parseInt('1556412148000')),
        );
        expect(response.json).toHaveBeenCalledWith({
          data: {
            id: 'earth',
            type: 'position',
            attributes: { x: 5, y: 6 },
          },
        });
      });
    });
  });
});
