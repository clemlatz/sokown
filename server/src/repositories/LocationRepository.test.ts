import LocationRepository from './LocationRepository';
import Position from '../models/Position';

describe('LocationRepository', () => {
  describe('getByCode', () => {
    test('it returns location matching code', () => {
      // given
      const locationRepository = new LocationRepository();

      // when
      const location = locationRepository.getByCode('earth');

      // then
      expect(location.name).toEqual('Earth');
    });

    test('it throws an error if location does not exist', () => {
      // given
      const locationRepository = new LocationRepository();

      // when
      const tested = () => locationRepository.getByCode('nibiru');

      // then
      expect(tested).toThrowError(new Error('Unknown location nibiru'));
    });
  });

  describe('findByPosition', () => {
    test('it returns a location matching position', () => {
      // given
      const locationRepository = new LocationRepository();
      const earthPosition = new Position(1, 1);

      // when
      const location = locationRepository.findByPosition(earthPosition);

      // then
      expect(location.name).toEqual('Earth');
    });

    test('it returns null if there is no location at position', () => {
      // given
      const locationRepository = new LocationRepository();
      const position = new Position(100, 100);

      // when
      const location = locationRepository.findByPosition(position);

      // then
      expect(location.name).toEqual('Space');
    });
  });
});
