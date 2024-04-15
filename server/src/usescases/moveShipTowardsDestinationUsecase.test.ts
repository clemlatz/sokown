import Position from '../models/Position';
import EventRepository from '../repositories/EventRepository';
import Location from '../models/Location';
import ModelFactory from '../../test/ModelFactory';
import LocationRepository from '../repositories/LocationRepository';
import MoveShipTowardsDestinationUsecase from './moveShipTowardsDestinationUsecase';

describe('moveShipTowardsDestinationUsecase', () => {
  describe('when ship is not yet at destination', () => {
    test('it move ship towards destination', async () => {
      // given
      const currentPosition = new Position(1, 1);
      const destinationPosition = new Position(3, 4);
      const ship = ModelFactory.createShip({
        speed: 100,
        currentPosition,
        destinationPosition,
      });
      const locationRepository = {
        findByPosition: jest.fn(
          () => new Location('mars', 'Mars', destinationPosition),
        ),
      } as unknown as LocationRepository;
      const eventRepository = {
        create: jest.fn(),
      } as unknown as EventRepository;
      const moveShipTowardsDestinationUsecase =
        new MoveShipTowardsDestinationUsecase(
          locationRepository,
          eventRepository,
        );

      // when
      const updatedShip = await moveShipTowardsDestinationUsecase.execute(ship);

      // then
      expect(eventRepository.create).not.toHaveBeenCalled();
      expect(updatedShip.currentPosition.x).toBe(1.0003707937837683);
      expect(updatedShip.currentPosition.y).toBe(1.0005561906756524);
    });
  });

  describe('when ship is at destination', () => {
    test('it does not move ship and reset ships destination', async () => {
      // given
      const currentPosition = new Position(23, 17);
      const destinationPosition = new Position(23, 17);
      const ship = ModelFactory.createShip({
        currentPosition,
        destinationPosition,
      });
      const locationRepository = {
        findByPosition: jest.fn(
          () => new Location('mars', 'Mars', destinationPosition),
        ),
      } as unknown as LocationRepository;
      const eventRepository = {
        create: jest.fn(),
      } as unknown as EventRepository;
      const moveShipTowardsDestinationUsecase =
        new MoveShipTowardsDestinationUsecase(
          locationRepository,
          eventRepository,
        );

      // when
      const updatedShip = await moveShipTowardsDestinationUsecase.execute(ship);

      // then
      const destinationLocation = new Location(
        'mars',
        'Mars',
        new Position(23, 17),
      );
      expect(eventRepository.create).toHaveBeenCalledWith(
        'has arrived at Mars ({23,17})',
        ship,
        destinationLocation,
      );
      expect(updatedShip.currentPosition.x).toBe(23);
      expect(updatedShip.currentPosition.y).toBe(17);
      expect(updatedShip.isStationary).toBe(true);
    });
  });
});
