import LocationRepository from "./LocationRepository";

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
});
