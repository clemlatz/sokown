import Position from '../models/Position';
import DistanceInSokownUnits from '../values/DistanceInSokownUnits';
import calculateDistanceBetweenPositions from './calculateDistanceBetweenPositions';

export const LOCATION_PROXIMITY_TOLERANCE = new DistanceInSokownUnits(0.1);

export default function isPositionWithinTolerance(
  position1: Position,
  position2: Position,
  tolerance: DistanceInSokownUnits = LOCATION_PROXIMITY_TOLERANCE,
): boolean {
  const distance = calculateDistanceBetweenPositions(position1, position2);
  return distance.value <= tolerance.value;
}
