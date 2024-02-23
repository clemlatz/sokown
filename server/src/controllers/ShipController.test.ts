import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

import { ShipController } from './ShipController';
import ShipRepository from '../repositories/ShipRepository';
import Ship from '../models/Ship';
import Position from '../models/Position';
import LocationRepository from '../repositories/LocationRepository';
import Location from '../models/Location';

describe('ShipController', () => {
  let shipController: ShipController;
  let shipRepository: ShipRepository;
  let locationRepository: LocationRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ShipController],
      providers: [PrismaClient, ShipRepository, LocationRepository],
    }).compile();

    shipController = app.get<ShipController>(ShipController);
    shipRepository = app.get<ShipRepository>(ShipRepository);
    locationRepository = app.get<LocationRepository>(LocationRepository);
  });

  describe('index', () => {
    it('it returns a list of ship', async () => {
      // given
      const response = {
        json: jest.fn(),
      } as unknown as Response;
      const ships = [
        new Ship(1, 'Discovery One', new Position(1, 1), null),
        new Ship(2, 'Europa Report', new Position(3, 4), new Position(23, 17)),
      ];
      jest
        .spyOn(shipRepository, 'getAll')
        .mockImplementation(async () => ships);
      jest
        .spyOn(locationRepository, 'findByPosition')
        .mockImplementation(
          () => new Location('earth', 'Earth', new Position(1, 1)),
        );

      // when
      await shipController.index(response);

      // then
      expect(response.json).toHaveBeenCalledWith({
        data: [
          {
            id: 1,
            type: 'ship',
            attributes: {
              name: 'Discovery One',
              currentPosition: { x: 1, y: 1 },
              currentLocation: { name: 'Earth' },
              destinationPosition: null,
              destinationLocation: null,
            },
          },
          {
            id: 2,
            type: 'ship',
            attributes: {
              name: 'Europa Report',
              currentPosition: { x: 3, y: 4 },
              currentLocation: { name: 'Earth' },
              destinationPosition: { x: 23, y: 17 },
              destinationLocation: { name: 'Earth' },
            },
          },
        ],
      });
    });
  });

  describe('get', () => {
    it('it returns a ship for given id', async () => {
      // given
      const response = {
        json: jest.fn(),
      } as unknown as Response;
      const ship = new Ship(1, 'Discovery One', new Position(1, 1), null);
      jest
        .spyOn(shipRepository, 'getById')
        .mockImplementation(async () => ship);

      // when
      await shipController.get(response, { id: '1' });

      // then
      expect(response.json).toHaveBeenCalledWith({
        data: {
          id: 1,
          type: 'ship',
          attributes: {
            name: 'Discovery One',
            currentPosition: { x: 1, y: 1 },
            currentLocation: { name: 'Earth' },
            destinationPosition: null,
            destinationLocation: null,
          },
        },
      });
    });
  });
});
