import Position from './Position';
import DistanceInSokownUnits from '../values/DistanceInSokownUnits';

export default class Location {
  private readonly _code: string;
  private readonly _name: string;
  private readonly _color: string;
  private _position: Position;
  private readonly _primaryBody: Location | null;
  private _distanceFromPrimaryBody: DistanceInSokownUnits;

  constructor(
    code: string,
    name: string,
    color: string,
    position: Position,
    primaryBody: Location | null = null,
  ) {
    this._code = code;
    this._name = name;
    this._position = position;
    this._primaryBody = primaryBody;
    this._color = color;
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  get color(): string {
    return this._color;
  }

  get position(): Position {
    return this._position;
  }

  setPosition(position: Position): void {
    this._position = new Position(position.roundedX, position.roundedY);
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
