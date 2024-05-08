import Position from './Position';
import DistanceInSokownUnits from '../values/DistanceInSokownUnits';

export default class Location {
  private readonly _code: string;
  private readonly _name: string;
  private _position: Position;
  private _primaryBody: Location | null;
  private _distanceFromPrimaryBody: DistanceInSokownUnits;

  constructor(
    code: string,
    name: string,
    position: Position,
    primaryBody: Location | null = null,
  ) {
    this._code = code;
    this._name = name;
    this._position = position;
    this._primaryBody = primaryBody;
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  get position(): Position {
    return this._position;
  }

  setPosition(position: Position): void {
    const xWithThreeDigits = Math.round(position.x * 1000) / 1000;
    const yWithThreeDigits = Math.round(position.y * 1000) / 1000;
    this._position = new Position(xWithThreeDigits, yWithThreeDigits);
  }

  get primaryBody(): Location {
    return this._primaryBody;
  }

  get distanceFromPrimaryBody(): DistanceInSokownUnits {
    return this._distanceFromPrimaryBody;
  }

  set distanceFromPrimaryBody(value: DistanceInSokownUnits) {
    this._distanceFromPrimaryBody = value;
  }
}
