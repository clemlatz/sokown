import Position from '../models/Position';
import calculateTimeToDestination from './calculateTimeToDestination';
import SpeedInKilometersPerSecond from '../values/SpeedInKilometersPerSecond';

describe('calculateTimeToDestination', () => {
  test('it returns time to destination', () => {
    // given
    const startPosition = new Position(1, 2);
    const endPosition = new Position(3, 4);
    const speed = new SpeedInKilometersPerSecond(100);

    // when
    const time = calculateTimeToDestination(startPosition, endPosition, speed);

    // then
    expect(time).toEqual(4231);
  });
});
