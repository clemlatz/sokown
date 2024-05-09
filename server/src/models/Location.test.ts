import Position from './Position';
import ModelFactory from '../../test/ModelFactory';

describe('Location', () => {
  describe('setPosition', () => {
    test('it should round coordinates to three digits', () => {
      // given
      const location = ModelFactory.createLocation({});
      const newPosition = new Position(3.14159265359, 1.61803398875);

      // when
      location.setPosition(newPosition);

      // then
      expect(location.position.x).toStrictEqual(3.142);
      expect(location.position.y).toStrictEqual(1.618);
    });
  });
});
