import moveShipTowardsDestinationUsecase from './moveShipTowardsDestinationUsecase';
import Position from '../models/Position';
import Ship from '../models/Ship';
import Location from '../models/Location';

describe('moveShipTowardsDestinationUsecase', () => {
  describe('when ship is not yet at destination', () => {
    test('it move ship towards destination', async () => {
      // given
      const currentPosition = new Position(1, 1);
      const destinationPosition = new Position(3, 4);
      const destination = new Location(
        'destination',
        'Destination',
        destinationPosition,
      );
      const ship = new Ship(1, 'Bebop', currentPosition, destination);
      const logger = jest.fn();

      // when
      const updatedShip = await moveShipTowardsDestinationUsecase(ship, logger);

      // then
      expect(logger).toHaveBeenCalledWith(
        'Ship Bebop moved to {1.5547001962252291,1.8320502943378436} (going to Destination)',
      );
      expect(updatedShip.currentPosition.x).toBe(1.5547001962252291);
      expect(updatedShip.currentPosition.y).toBe(1.8320502943378436);
    });
  });

  describe('when ship is at destination', () => {
    test('it does not move ship', async () => {
      // given
      const startPosition = new Position(3, 4);
      const destinationPosition = new Position(3, 4);
      const destination = new Location(
        'destination',
        'Destination',
        destinationPosition,
      );
      const ship = new Ship(1, 'Cepheus', startPosition, destination);
      const logger = jest.fn();

      // when
      const updatedShip = await moveShipTowardsDestinationUsecase(ship, logger);

      // then
      expect(logger).toHaveBeenCalledWith(
        'Ship Cepheus has arrived at Destination',
      );
      expect(updatedShip.currentPosition.x).toBe(3);
      expect(updatedShip.currentPosition.y).toBe(4);
    });
  });
});
