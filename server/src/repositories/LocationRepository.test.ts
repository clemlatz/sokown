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

    test('it returns a location when position is within 0.1 SU tolerance', () => {
      // given
      const locationRepository = new LocationRepository();
      const earth = locationRepository.getByCode('earth');
      const earthPosition = new Position(758, 653);
      earth.setPosition(earthPosition);

      // Ship position slightly off from Earth (within 0.1 SU)
      const shipPosition = new Position(758.05, 653.05);
      // Distance: sqrt(0.05^2 + 0.05^2) ≈ 0.0707 SU < 0.1 SU

      // when
      const location = locationRepository.findByPosition(shipPosition);

      // then
      expect(location.name).toEqual('Earth');
    });

    test('it returns Space if position is outside 0.1 SU tolerance', () => {
      // given
      const locationRepository = new LocationRepository();
      const earth = locationRepository.getByCode('earth');
      const earthPosition = new Position(758, 653);
      earth.setPosition(earthPosition);

      // Ship position too far from Earth (> 0.1 SU)
      const shipPosition = new Position(758.15, 653.0);
      // Distance: 0.15 SU > 0.1 SU

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

      // Set Earth and Moon close together (both within 0.1 SU of test position)
      const earthPosition = new Position(500, 500);
      const moonPosition = new Position(500.08, 500.06);
      earth.setPosition(earthPosition);
      moon.setPosition(moonPosition);

      // Ship position closer to Earth than Moon
      const shipPosition = new Position(500.02, 500.015);
      // Distance to Earth: sqrt(0.02^2 + 0.015^2) ≈ 0.025 SU
      // Distance to Moon: sqrt(0.06^2 + 0.045^2) ≈ 0.075 SU

      // when
      const location = locationRepository.findByPosition(shipPosition);

      // then
      expect(location.name).toEqual('Earth');
    });
  });
});
