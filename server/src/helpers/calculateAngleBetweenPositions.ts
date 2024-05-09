import Position from '../models/Position';
import OrientationInDegrees from '../values/OrientationInDegrees';

export default function calculateAngleBetweenPositions(
  position1: Position,
  position2: Position,
): OrientationInDegrees {
  const angleInRadians = Math.atan2(
    position2.y - position1.y,
    position2.x - position1.x,
  );
  const angleInDegrees = (angleInRadians * 180) / Math.PI;
  const angleFromYPositiveAxis = angleInDegrees;
  const newCourse =
    angleFromYPositiveAxis >= 0
      ? angleFromYPositiveAxis
      : angleFromYPositiveAxis + 360;
  const orientationInDegrees = new OrientationInDegrees(newCourse);
  return orientationInDegrees;
}
