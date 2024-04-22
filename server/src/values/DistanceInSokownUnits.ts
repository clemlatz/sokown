import DistanceInKilometers from './DistanceInKilometers';

export default class DistanceInSokownUnits {
  private readonly _value: number;

  get value(): number {
    return this._value;
  }

  get valueInKilometers(): DistanceInKilometers {
    return new DistanceInKilometers(this._value / 0.00000668458);
  }

  constructor(value: number) {
    this._value = value;
  }
}
