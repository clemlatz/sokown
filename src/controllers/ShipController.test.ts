import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

import { ShipController } from './ShipController';
import ShipRepository from '../repositories/ShipRepository';
import Ship from '../models/Ship';
import Position from '../models/Position';
import Location from '../models/Location';

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
      const destination = new Location('europa', 'Europa', new Position(5, 6));
      const ships = [
        new Ship(1, 'Discovery One', new Position(1, 2), null),
        new Ship(2, 'Europa Report', new Position(3, 4), destination),
      ];
      jest
        .spyOn(shipRepository, 'getAll')
        .mockImplementation(async () => ships);

      // when
      await shipController.index(response);

      // then
      expect(response.json).toHaveBeenCalledWith([
        {
          id: 1,
          name: 'Discovery One',
          position: { x: 1, y: 2 },
          destination: null,
        },
        {
          id: 2,
          name: 'Europa Report',
          position: { x: 3, y: 4 },
          destination: { name: 'Europa' },
        },
      ]);
    });
  });
});
