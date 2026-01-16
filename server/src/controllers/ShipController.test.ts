import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

import { ShipController } from './ShipController';
import ShipRepository from '../repositories/ShipRepository';
import Position from '../models/Position';
import LocationRepository from '../repositories/LocationRepository';
import EventRepository from '../repositories/EventRepository';
import ModelFactory from '../../test/ModelFactory';
import AuthenticationGuard from '../guards/AuthenticationGuard';
import AuthenticationMethodRepository from '../repositories/AuthenticationMethodRepository';
import User from '../models/User';
import OrientationInDegrees from '../values/OrientationInDegrees';

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
        AuthenticationGuard,
        AuthenticationMethodRepository,
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
          owner: new User(3, 'David Bowman', 'david@example.com', false),
          speed: 100,
          name: 'Discovery One',
          currentPosition: new Position(1, 1),
        }),
        ModelFactory.createShip({
          id: 2,
          owner: new User(4, 'James Corrigan', 'james@example.com', true),
          speed: 200,
          name: 'Europa Report',
          currentPosition: new Position(3, 4),
          currentCourse: new OrientationInDegrees(88),
          destinationPosition: new Position(23, 17),
        }),
      ];
      jest
        .spyOn(shipRepository, 'getAll')
        .mockImplementation(async () => ships);
      jest
        .spyOn(locationRepository, 'findByPosition')
        .mockImplementation(() => ModelFactory.createLocation({}));

      // when
      await shipController.index(response);

      // then
      expect(response.json).toHaveBeenCalledWith({
        data: [
          {
            id: 1,
            type: 'ship',
            attributes: {
              owner: {
                id: 3,
                pilotName: 'David Bowman',
              },
              name: 'Discovery One',
              speedInKilometersPerSecond: 100,
              currentPosition: { x: 1, y: 1 },
              currentLocation: { name: 'Earth' },
              currentCourse: 0,
              destinationPosition: null,
              destinationLocation: null,
              timeToDestination: null,
            },
          },
          {
            id: 2,
            type: 'ship',
            attributes: {
              owner: {
                id: 4,
                pilotName: 'James Corrigan',
              },
              name: 'Europa Report',
              speedInKilometersPerSecond: 200,
              currentPosition: { x: 3, y: 4 },
              currentLocation: { name: 'Earth' },
              currentCourse: 88,
              destinationPosition: { x: 23, y: 17 },
              destinationLocation: { name: 'Earth' },
              timeToDestination: null,
            },
          },
        ],
      });
    });
  });

  describe('get', () => {
    it('it returns a ship for without destination', async () => {
      // given
      const response = {
        json: jest.fn(),
      } as unknown as Response;
      const ship = ModelFactory.createShip({
        id: 1,
        owner: new User(2, 'David Bowman', 'david@example.com', false),
        speed: 100,
        name: 'Discovery One',
        currentPosition: new Position(1, 2),
        currentCourse: new OrientationInDegrees(0),
        destinationPosition: null,
      });
      jest
        .spyOn(shipRepository, 'getById')
        .mockImplementation(async () => ship);
      jest
        .spyOn(locationRepository, 'findByPosition')
        .mockReturnValueOnce(ModelFactory.createLocation({}));

      // when
      await shipController.get(response, { id: '1' });

      // then
      expect(response.json).toHaveBeenCalledWith({
        data: {
          id: 1,
          type: 'ship',
          attributes: {
            owner: { id: 2, pilotName: 'David Bowman' },
            name: 'Discovery One',
            speedInKilometersPerSecond: 100,
            currentPosition: { x: 1, y: 2 },
            currentCourse: 0,
            currentLocation: { name: 'Earth' },
            destinationPosition: null,
            destinationLocation: null,
            timeToDestination: null,
          },
        },
      });
    });

    it('it returns a ship with a destination', async () => {
      // given
      const response = {
        json: jest.fn(),
      } as unknown as Response;
      const ship = ModelFactory.createShip({
        id: 1,
        owner: new User(2, 'David Bowman', 'david@example.com', false),
        speed: 100,
        name: 'Discovery One',
        currentPosition: new Position(1, 2),
        currentCourse: new OrientationInDegrees(84),
        destinationPosition: new Position(3, 4),
      });
      jest
        .spyOn(shipRepository, 'getById')
        .mockImplementation(async () => ship);
      jest
        .spyOn(locationRepository, 'findByPosition')
        .mockReturnValueOnce(
          ModelFactory.createLocation({ code: 'earth', name: 'Earth' }),
        )
        .mockReturnValueOnce(
          ModelFactory.createLocation({ code: 'moon', name: 'Moon' }),
        );

      // when
      await shipController.get(response, { id: '1' });

      // then
      expect(response.json).toHaveBeenCalledWith({
        data: {
          id: 1,
          type: 'ship',
          attributes: {
            owner: { id: 2, pilotName: 'David Bowman' },
            name: 'Discovery One',
            speedInKilometersPerSecond: 100,
            currentPosition: { x: 1, y: 2 },
            currentCourse: 84,
            currentLocation: { name: 'Earth' },
            destinationPosition: { x: 3, y: 4 },
            destinationLocation: { name: 'Moon' },
            timeToDestination: 4231,
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
      const earthLocation = ModelFactory.createLocation({});
      const marsPosition = new Position(3, 4);
      const marsLocation = ModelFactory.createLocation({
        code: 'mars',
        name: 'Mars',
      });
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
