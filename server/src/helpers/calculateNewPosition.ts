import Position from '../models/Position';
import calculateDistanceBetweenPositions from './calculateDistanceBetweenPositions';
import convertKilometersToSokownUnits from './convertKilometersToSokownUnits';
import DistanceInKilometers from '../values/DistanceInKilometers';

export default function calculateNewPosition(
  startPosition: Position,
  destinationPosition: Position,
  distanceTraveledInKm: DistanceInKilometers,
): Position {
  const distanceToDestinationInSU = calculateDistanceBetweenPositions(
    startPosition,
    destinationPosition,
  );
  const distanceTraveledInSU =
    convertKilometersToSokownUnits(distanceTraveledInKm);

  if (distanceToDestinationInSU < distanceTraveledInSU) {
    return destinationPosition;
  }

  const newX =
    startPosition.x +
    ((destinationPosition.x - startPosition.x) * distanceTraveledInSU) /
      distanceToDestinationInSU;
  const newY =
    startPosition.y +
    ((destinationPosition.y - startPosition.y) * distanceTraveledInSU) /
      distanceToDestinationInSU;

  return new Position(newX, newY);
}
