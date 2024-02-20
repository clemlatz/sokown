import Position from "./Position";

export default class Location {

  private readonly _code: string;
  private readonly _name: string;
  private readonly _position: Position = new Position(0,0);

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
}
