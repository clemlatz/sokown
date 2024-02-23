import Position from './Position';
import Ship from './Ship';

describe('Ship', () => {
  describe('destinationPosition', () => {
    test('it prints position', () => {
      // given
      const ship = new Ship(
        1,
        'Hermes',
        new Position(1, 2),
        new Position(3, 4),
      );

      // when
      const destinationPosition = ship.destinationPosition;

      // then
      expect(destinationPosition).toEqual(new Position(3, 4));
    });

    test('it throws an error if there is no destination', () => {
      // given
      const ship = new Ship(1, 'Hermes', new Position(1, 2), null);

      // when
      const tested = () => ship.destinationPosition;

      // then
      expect(tested).toThrowError(new Error('Ship Hermes has no destination'));
    });
  });
});
