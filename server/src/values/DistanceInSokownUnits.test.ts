import DistanceInKilometers from '../values/DistanceInKilometers';
import DistanceInSokownUnits from './DistanceInSokownUnits';

describe('get valueInKilometers', () => {
  test('it converts kilometers to sokown units', () => {
    // given
    const distanceInSokownUnits = new DistanceInSokownUnits(1);

    // when
    const kilometers = distanceInSokownUnits.valueInKilometers;

    // then
    expect(kilometers).toEqual(new DistanceInKilometers(149598.03009313974));
  });
});
