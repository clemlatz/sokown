import calculateAngleBetweenPositions from './calculateAngleBetweenPositions';
import Position from '../models/Position';
import OrientationInDegrees from '../values/OrientationInDegrees';

describe('calculateAngleBetweenPositions', () => {
  test('it calculates angle between two positions', () => {
    // given
    const position1 = new Position(0, 0);
    const position2 = new Position(1, 1);

    // when
    const angle = calculateAngleBetweenPositions(position1, position2);

    // then
    expect(angle).toEqual(new OrientationInDegrees(45));
  });
});
