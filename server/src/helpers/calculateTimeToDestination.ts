import Position from '../models/Position';
import SpeedInKilometersPerSecond from '../values/SpeedInKilometersPerSecond';
import calculateDistanceBetweenPositions from './calculateDistanceBetweenPositions';

type TimeInSeconds = number;

export default function calculateTimeToDestination(
  startPosition: Position,
  endPosition: Position,
  speed: SpeedInKilometersPerSecond,
): TimeInSeconds {
  const distance = calculateDistanceBetweenPositions(
    startPosition,
    endPosition,
  );
  return Math.round(distance.valueInKilometers.value / speed.value);
}
