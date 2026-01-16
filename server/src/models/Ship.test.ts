import Ship from './Ship';
import Position from './Position';
import SpeedInKilometersPerSecond from '../values/SpeedInKilometersPerSecond';
import User from './User';
import OrientationInDegrees from '../values/OrientationInDegrees';

describe('Ship', () => {
  describe('destinationPosition', () => {
    test('it prints position', () => {
      // given
      const owner = new User(
        2,
        'Raymonde de Laroche',
        'raymonde@example.com',
        false,
      );
      const ship = new Ship(
        1,
        owner,
        'Hermes',
        new SpeedInKilometersPerSecond(1),
        new Position(1, 2),
        new OrientationInDegrees(0),
        new Position(3, 4),
        null,
      );

      // when
      const destinationPosition = ship.destinationPosition;

      // then
      expect(destinationPosition).toEqual(new Position(3, 4));
    });

    test('it throws an error if there is no destination', () => {
      // given
      const owner = new User(
        2,
        'Raymonde de Laroche',
        'raymonde@example.com',
        false,
      );
      const ship = new Ship(
        1,
        owner,
        'Hermes',
        new SpeedInKilometersPerSecond(1),
        new Position(1, 2),
        new OrientationInDegrees(0),
        null,
        null,
      );

      // when
      const tested = () => ship.destinationPosition;

      // then
      expect(tested).toThrowError(new Error('Ship Hermes has no destination'));
    });
  });
});
