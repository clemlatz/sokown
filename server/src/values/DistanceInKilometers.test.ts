import DistanceInKilometers from '../values/DistanceInKilometers';

describe('get valueInSokownUnits', () => {
  test('it converts kilometers to sokown units', () => {
    // given
    const kilometers = new DistanceInKilometers(1);

    // when
    const sokownUnits = kilometers.valueInSokownUnits;

    // then
    expect(sokownUnits).toBe(0.00000668458);
  });
});
