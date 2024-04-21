import Position from './Position';
import Location from './Location';

describe('Location', () => {
  describe('setPosition', () => {
    test('it should round coordinates to two digits', () => {
      // given
      const location = new Location('earth', 'Earth', new Position(1, 1));
      const newPosition = new Position(3.14159265359, 1.61803398875);

      // when
      location.setPosition(newPosition);

      // then
      expect(location.position.x).toStrictEqual(3.14);
      expect(location.position.y).toStrictEqual(1.62);
    });
  });
});
