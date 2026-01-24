import Position from '../models/Position';
import DistanceInSokownUnits from '../values/DistanceInSokownUnits';
import calculateDistanceBetweenPositions from './calculateDistanceBetweenPositions';

function getLocationProximityTolerance() {
  const valueFromEnv = process.env.LOCATION_PROXIMITY_TOLERANCE || '1';
  const valueAsFloat = parseFloat(valueFromEnv);
  return new DistanceInSokownUnits(valueAsFloat);
}

export default function isPositionWithinTolerance(
  position1: Position,
  position2: Position,
): boolean {
  const distance = calculateDistanceBetweenPositions(position1, position2);
  return distance.value <= getLocationProximityTolerance().value;
}
