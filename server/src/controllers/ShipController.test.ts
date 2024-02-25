import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

import { ShipController } from './ShipController';
import ShipRepository from '../repositories/ShipRepository';
import Position from '../models/Position';
import LocationRepository from '../repositories/LocationRepository';
import Location from '../models/Location';
import { HttpStatus } from '@nestjs/common';
import EventRepository from '../repositories/EventRepository';
import ModelFactory from '../../test/ModelFactory';

describe('ShipController', () => {
  let shipController: ShipController;
  let shipRepository: ShipRepository;
  let locationRepository: LocationRepository;
  let eventRepository: EventRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ShipController],
      providers: [
        PrismaClient,
        ShipRepository,
        LocationRepository,
        EventRepository,
      ],
    }).compile();

    shipController = app.get<ShipController>(ShipController);
    shipRepository = app.get<ShipRepository>(ShipRepository);
    locationRepository = app.get<LocationRepository>(LocationRepository);
    eventRepository = app.get<EventRepository>(EventRepository);
  });

  describe('index', () => {
    it('it returns a list of ship', async () => {
      // given
      const response = {
        json: jest.fn(),
      } as unknown as Response;
      const ships = [
        ModelFactory.createShip({
          id: 1,
          name: 'Discovery One',
          currentPosition: new Position(1, 1),
        }),
        ModelFactory.createShip({
          id: 2,
          name: 'Europa Report',
          currentPosition: new Position(3, 4),
          destinationPosition: new Position(23, 17),
        }),
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
      const ship = ModelFactory.createShip({
        id: 1,
        name: 'Discovery One',
        currentPosition: new Position(1, 1),
      });
      jest
        .spyOn(shipRepository, 'getById')
        .mockImplementation(async () => ship);
      jest
        .spyOn(locationRepository, 'findByPosition')
        .mockReturnValue(new Location('earth', 'Earth', new Position(1, 1)));

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

  describe('update', () => {
    it('it updates a ship for given id', async () => {
      // given
      const response = {
        status: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;
      const earthPosition = new Position(1, 2);
      const earthLocation = new Location('earth', 'Earth', earthPosition);
      const marsPosition = new Position(3, 4);
      const marsLocation = new Location('mars', 'Mars', marsPosition);
      const ship = ModelFactory.createShip({
        id: 1,
        name: 'Discovery One',
        currentPosition: earthPosition,
      });
      jest
        .spyOn(shipRepository, 'getById')
        .mockImplementation(async () => ship);
      jest.spyOn(shipRepository, 'update').mockImplementation();
      jest.spyOn(eventRepository, 'create').mockImplementation();
      jest
        .spyOn(locationRepository, 'findByPosition')
        .mockReturnValueOnce(earthLocation);
      jest
        .spyOn(locationRepository, 'findByPosition')
        .mockReturnValueOnce(marsLocation);
      const payload = {
        data: {
          attributes: {
            destinationPosition: {
              x: 3,
              y: 4,
            },
          },
        },
      };

      // when
      await shipController.update({ id: '1' }, payload, response);

      // then
      const updatedShip = ModelFactory.createShip({
        id: 1,
        name: 'Discovery One',
        currentPosition: earthPosition,
        destinationPosition: marsPosition,
      });
      expect(shipRepository.update).toHaveBeenCalledWith(updatedShip);
      expect(eventRepository.create).toHaveBeenCalledWith(
        'has departed from Earth to Mars',
        ship,
        earthLocation,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(response.send).toHaveBeenCalledWith();
    });
  });
});
