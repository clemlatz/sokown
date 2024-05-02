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
    const xWithThreeDigits = Math.round(position.x * 1000) / 1000;
    const yWithThreeDigits = Math.round(position.y * 1000) / 1000;
    this._position = new Position(xWithThreeDigits, yWithThreeDigits);
  }
}
