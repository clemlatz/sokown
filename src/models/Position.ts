export default class Position {
  private readonly _x: number;
  private readonly _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  toString(): string {
    return `{${this.x},${this.y}}`;
  }
}
