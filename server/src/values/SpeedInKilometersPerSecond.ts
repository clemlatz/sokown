export default class SpeedInKilometersPerSecond {
  private readonly _value: number;

  get value(): number {
    return this._value;
  }

  constructor(value: number) {
    this._value = value;
  }
}
