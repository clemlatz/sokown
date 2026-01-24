import LocationRepository from './LocationRepository';
import Position from '../models/Position';

describe('LocationRepository', () => {
  describe('getAll', () => {
    it('should return an array of locations', () => {
      // given
      const repository = new LocationRepository();

      // when
      const locations = repository.getAll();

      // then
      expect(locations[0].name).toStrictEqual('Sun');
    });
  });

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
    test('it returns a location matching exact position', () => {
      // given
      const locationRepository = new LocationRepository();
      const earth = locationRepository.getByCode('earth');
      const earthPosition = new Position(758, 653);
      earth.setPosition(earthPosition);

      // when
      const location = locationRepository.findByPosition(earthPosition);

      // then
      expect(location.name).toEqual('Earth');
    });

    test('it returns a location when position is within 1 SU tolerance', () => {
      // given
      const locationRepository = new LocationRepository();
      const earth = locationRepository.getByCode('earth');
      const earthPosition = new Position(758, 653);
      earth.setPosition(earthPosition);

      // Ship position slightly off from Earth (within 1 SU)
      const shipPosition = new Position(758.5, 653.5);
      // Distance: sqrt(0.5^2 + 0.5^2) ≈ 0.707 SU < 1 SU

      // when
      const location = locationRepository.findByPosition(shipPosition);

      // then
      expect(location.name).toEqual('Earth');
    });

    test('it returns Space if position is outside 1 SU tolerance', () => {
      // given
      const locationRepository = new LocationRepository();
      const earth = locationRepository.getByCode('earth');
      const earthPosition = new Position(758, 653);
      earth.setPosition(earthPosition);

      // Ship position too far from Earth (> 1 SU)
      const shipPosition = new Position(759.5, 653.0);
      // Distance: 1.5 SU > 1 SU

      // when
      const location = locationRepository.findByPosition(shipPosition);

      // then
      expect(location.name).toEqual('Space');
    });

    test('it returns Space if there is no location at position', () => {
      // given
      const locationRepository = new LocationRepository();
      const position = new Position(100, 100);

      // when
      const location = locationRepository.findByPosition(position);

      // then
      expect(location.name).toEqual('Space');
    });

    test('it returns closest location when multiple locations are within tolerance', () => {
      // given
      const locationRepository = new LocationRepository();
      const earth = locationRepository.getByCode('earth');
      const moon = locationRepository.getByCode('moon');

      // Set Earth and Moon close together (both within 1 SU of test position)
      const earthPosition = new Position(500, 500);
      const moonPosition = new Position(500.8, 500.6);
      earth.setPosition(earthPosition);
      moon.setPosition(moonPosition);

      // Ship position closer to Earth than Moon
      const shipPosition = new Position(500.2, 500.15);
      // Distance to Earth: sqrt(0.2^2 + 0.15^2) ≈ 0.25 SU
      // Distance to Moon: sqrt(0.6^2 + 0.45^2) ≈ 0.75 SU

      // when
      const location = locationRepository.findByPosition(shipPosition);

      // then
      expect(location.name).toEqual('Earth');
    });
  });
});
