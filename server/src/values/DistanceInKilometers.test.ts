import DistanceInKilometers from '../values/DistanceInKilometers';
import DistanceInSokownUnits from './DistanceInSokownUnits';

describe('get valueInSokownUnits', () => {
  test('it converts kilometers to sokown units', () => {
    // given
    const kilometers = new DistanceInKilometers(1);

    // when
    const sokownUnits = kilometers.valueInSokownUnits;

    // then
    expect(sokownUnits).toEqual(new DistanceInSokownUnits(0.00000668458));
  });
});
