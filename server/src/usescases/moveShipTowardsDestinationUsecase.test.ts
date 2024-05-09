import Position from '../models/Position';
import EventRepository from '../repositories/EventRepository';
import ModelFactory from '../../test/ModelFactory';
import LocationRepository from '../repositories/LocationRepository';
import MoveShipTowardsDestinationUsecase from './moveShipTowardsDestinationUsecase';
import OrientationInDegrees from '../values/OrientationInDegrees';

describe('moveShipTowardsDestinationUsecase', () => {
  describe('when ship is not yet at destination', () => {
    test('it updates position and course towards destination', async () => {
      // given
      const currentPosition = new Position(1, 1);
      const destinationPosition = new Position(3, 4);
      const ship = ModelFactory.createShip({
        speed: 100,
        currentPosition,
        currentCourse: new OrientationInDegrees(0),
        destinationPosition,
      });
      const locationRepository = {
        findByPosition: jest.fn(() =>
          ModelFactory.createLocation({
            name: 'Mars',
            position: destinationPosition,
          }),
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
      expect(updatedShip.currentCourse.value).toBe(56.3);
    });
  });

  describe('when ship is at destination', () => {
    test("it does not move ship and sets ship's location", async () => {
      // given
      const currentPosition = new Position(23, 17);
      const destinationPosition = new Position(23, 17);
      const ship = ModelFactory.createShip({
        currentPosition,
        destinationPosition,
      });
      const locationRepository = {
        findByPosition: jest.fn(() =>
          ModelFactory.createLocation({ code: 'mars', name: 'Mars' }),
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
      const destinationLocation = ModelFactory.createLocation({
        code: 'mars',
        name: 'Mars',
      });
      expect(eventRepository.create).toHaveBeenCalledWith(
        'has arrived at Mars ({23,17})',
        ship,
        destinationLocation,
      );
      expect(updatedShip.currentPosition.x).toBe(23);
      expect(updatedShip.currentPosition.y).toBe(17);
      expect(updatedShip.isStationary).toBe(true);
      expect(updatedShip.currentLocationCode).toBe('mars');
    });
  });
});
