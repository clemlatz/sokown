import DistanceInKilometers from '../values/DistanceInKilometers';

export default function convertKilometersToSokownUnits(
  distance: DistanceInKilometers,
) {
  return distance.value * 0.00000668458;
}
