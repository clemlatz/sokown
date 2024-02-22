import moveShipTowardsDestinationUsecase from './moveShipTowardsDestinationUsecase';
import Position from '../models/Position';
import Ship from '../models/Ship';

describe('moveShipTowardsDestinationUsecase', () => {
  describe('when ship is not yet at destination', () => {
    test('it move ship towards destination', async () => {
      // given
      const currentPosition = new Position(1, 1);
      const destinationPosition = new Position(3, 4);
      const ship = new Ship(1, 'Bebop', currentPosition, destinationPosition);
      const logger = jest.fn();

      // when
      const updatedShip = await moveShipTowardsDestinationUsecase(ship, logger);

      // then
      expect(logger).toHaveBeenCalledWith(
        'Ship Bebop moved to {1.5547001962252291,1.8320502943378436}',
      );
      expect(updatedShip.currentPosition.x).toBe(1.5547001962252291);
      expect(updatedShip.currentPosition.y).toBe(1.8320502943378436);
    });
  });

  describe('when ship is at destination', () => {
    test('it does not move ship and reset ships destination', async () => {
      // given
      const startPosition = new Position(3, 4);
      const destinationPosition = new Position(3, 4);
      const ship = new Ship(1, 'Cepheus', startPosition, destinationPosition);
      const logger = jest.fn();

      // when
      const updatedShip = await moveShipTowardsDestinationUsecase(ship, logger);

      // then
      expect(logger).toHaveBeenCalledWith('Ship Cepheus has arrived at {3,4}');
      expect(updatedShip.currentPosition.x).toBe(3);
      expect(updatedShip.currentPosition.y).toBe(4);
      expect(updatedShip.isStationary).toBe(true);
    });

    test('it announce location if any', async () => {
      // given
      const currentPosition = new Position(23, 17);
      const destinationPosition = new Position(23, 17);
      const ship = new Ship(
        1,
        'Excelsior',
        currentPosition,
        destinationPosition,
      );
      const logger = jest.fn();

      // when
      await moveShipTowardsDestinationUsecase(ship, logger);

      // then
      expect(logger).toHaveBeenCalledWith(
        'Ship Excelsior has arrived at Mars ({23,17})',
      );
    });
  });
});
