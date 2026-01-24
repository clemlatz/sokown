import Position from '../models/Position';
import isPositionWithinTolerance from './isPositionWithinTolerance';

describe('isPositionWithinTolerance', () => {
  it('returns true for identical positions', () => {
    const position1 = new Position(10.0, 20.0);
    const position2 = new Position(10.0, 20.0);

    expect(isPositionWithinTolerance(position1, position2)).toBe(true);
  });

  it('returns true for positions within tolerance', () => {
    const position1 = new Position(10.0, 20.0);
    const position2 = new Position(10.5, 20.5);

    // Distance: sqrt(0.5^2 + 0.5^2) ≈ 0.707 SU < 1 SU
    expect(isPositionWithinTolerance(position1, position2)).toBe(true);
  });

  it('returns true for positions exactly at tolerance boundary', () => {
    const position1 = new Position(0.0, 0.0);
    const position2 = new Position(1.0, 0.0);

    // Distance: exactly 1 SU
    expect(isPositionWithinTolerance(position1, position2)).toBe(true);
  });

  it('returns false for positions outside tolerance', () => {
    const position1 = new Position(10.0, 20.0);
    const position2 = new Position(11.5, 20.0);

    // Distance: 1.5 SU > 1 SU
    expect(isPositionWithinTolerance(position1, position2)).toBe(false);
  });

  it('returns false for positions significantly outside tolerance', () => {
    const position1 = new Position(1.0, 1.0);
    const position2 = new Position(3.0, 4.0);

    // Distance: sqrt(4 + 9) ≈ 3.606 SU >> 1 SU
    expect(isPositionWithinTolerance(position1, position2)).toBe(false);
  });

  it('uses default tolerance of 1 SU', () => {
    const position1 = new Position(5.0, 5.0);
    const position2 = new Position(5.8, 5.6);

    // Distance: sqrt(0.8^2 + 0.6^2) = 1 SU
    expect(isPositionWithinTolerance(position1, position2)).toBe(true);
  });
});
