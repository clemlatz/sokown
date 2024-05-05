import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

import LocationController from './LocationController';
import LocationRepository from '../repositories/LocationRepository';
import Position from '../models/Position';
import Location from '../models/Location';
import AstronomyService from '../services/AstronomyService';

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
    const locations = [
      new Location('earth', 'Earth', new Position(1, 2)),
      new Location('moon', 'Moon', new Position(3, 4)),
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
            id: 'earth',
            type: 'location',
            attributes: {
              name: 'Earth',
              position: { x: 1, y: 2 },
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
