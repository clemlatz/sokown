import DistanceInSokownUnits from './DistanceInSokownUnits';

export default class DistanceInKilometers {
  private readonly _value: number;

  get value(): number {
    return this._value;
  }

  get valueInSokownUnits(): DistanceInSokownUnits {
    return new DistanceInSokownUnits(this._value);
  }

  constructor(value: number) {
    this._value = value;
  }
}
