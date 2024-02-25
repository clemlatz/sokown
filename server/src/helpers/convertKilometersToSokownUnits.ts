import DistanceInKilometers from '../values/DistanceInKilometers';
import DistanceInSokownUnits from '../values/DistanceInSokownUnits';

export default function convertKilometersToSokownUnits(
  distance: DistanceInKilometers,
): DistanceInSokownUnits {
  return new DistanceInSokownUnits(distance.value * 0.00000668458);
}
