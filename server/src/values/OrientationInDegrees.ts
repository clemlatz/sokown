export default class OrientationInDegrees {
  private readonly _value: number;

  constructor(value: number) {
    this._value = Math.round(value * 10) / 10;
  }

  get value(): number {
    return this._value;
  }
}
