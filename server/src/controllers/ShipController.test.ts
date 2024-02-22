import {Test, TestingModule} from '@nestjs/testing';
import {PrismaClient} from '@prisma/client';
import {Response} from 'express';

import {ShipController} from './ShipController';
import ShipRepository from '../repositories/ShipRepository';
import Ship from '../models/Ship';
import Position from '../models/Position';

describe('ShipController', () => {
  let shipController: ShipController;
  let shipRepository: ShipRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ShipController],
      providers: [PrismaClient, ShipRepository],
    }).compile();

    shipController = app.get<ShipController>(ShipController);
    shipRepository = app.get<ShipRepository>(ShipRepository);
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
              currentPosition: {x: 1, y: 1},
              currentLocation: {name: 'Earth'},
              destinationPosition: null,
              destinationLocation: null,
            }
          },
          {
            id: 2,
            type: 'ship',
            attributes: {
              name: 'Europa Report',
              currentPosition: {x: 3, y: 4},
              currentLocation: {name: 'Space'},
              destinationPosition: {x: 23, y: 17},
              destinationLocation: {name: 'Mars'},
            }
          },
        ]
      });
    });
  });
});
