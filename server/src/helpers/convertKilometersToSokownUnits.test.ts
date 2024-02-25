import convertKilometersToSokownUnits from './convertKilometersToSokownUnits';
import DistanceInKilometers from '../values/DistanceInKilometers';

describe('convertKilometersToSokownUnits', () => {
  test('it converts kilometers to sokown units', () => {
    // given
    const kilometers = new DistanceInKilometers(1);

    // when
    const sokownUnits = convertKilometersToSokownUnits(kilometers);

    // then
    expect(sokownUnits).toBe(0.00000668458);
  });
});
