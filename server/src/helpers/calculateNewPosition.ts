import Position from '../models/Position';
import calculateDistanceBetweenPositions from './calculateDistanceBetweenPositions';
import DistanceInKilometers from '../values/DistanceInKilometers';

export default function calculateNewPosition(
  startPosition: Position,
  destinationPosition: Position,
  distanceTraveled: DistanceInKilometers,
): Position {
  const distanceToDestinationInSU = calculateDistanceBetweenPositions(
    startPosition,
    destinationPosition,
  );
  const distanceTraveledInSU = distanceTraveled.valueInSokownUnits;

  if (distanceToDestinationInSU.value < distanceTraveledInSU.value) {
    return destinationPosition;
  }

  const newX =
    startPosition.x +
    ((destinationPosition.x - startPosition.x) * distanceTraveledInSU.value) /
      distanceToDestinationInSU.value;
  const newY =
    startPosition.y +
    ((destinationPosition.y - startPosition.y) * distanceTraveledInSU.value) /
      distanceToDestinationInSU.value;

  return new Position(newX, newY);
}
