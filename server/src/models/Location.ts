import Position from './Position';

export default class Location {
  private readonly _code: string;
  private readonly _name: string;
  private _position: Position;

  constructor(code: string, name: string, position: Position) {
    this._code = code;
    this._name = name;
    this._position = position;
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
    const xWithTwoDigits = Math.round(position.x * 100) / 100;
    const yWithTwoDigits = Math.round(position.y * 100) / 100;
    this._position = new Position(xWithTwoDigits, yWithTwoDigits);
  }
}
