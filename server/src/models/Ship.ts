import Position from './Position';
import SpeedInKilometersPerSecond from '../values/SpeedInKilometersPerSecond';
import User from './User';

export default class Ship {
  private readonly _id: number;
  private readonly _owner: User;
  private readonly _name: string;
  private readonly _speed: SpeedInKilometersPerSecond;
  private _currentPosition: Position = new Position(0, 0);
  private _destinationPosition: Position | null;

  constructor(
    id: number,
    owner: User,
    name: string,
    speed: SpeedInKilometersPerSecond,
    currentPosition: Position,
    destinationPosition: Position | null,
  ) {
    this._id = id;
    this._owner = owner;
    this._name = name;
    this._speed = speed;
    this._currentPosition = currentPosition;
    this._destinationPosition = destinationPosition;
  }

  get id(): number {
    return this._id;
  }

  get owner(): User {
    return this._owner;
  }

  get name(): string {
    return this._name;
  }

  get speed(): SpeedInKilometersPerSecond {
    return this._speed;
  }

  get currentPosition(): Position {
    return this._currentPosition;
  }

  set currentPosition(value: Position) {
    this._currentPosition = value;
  }

  get destinationPosition(): Position {
    if (this._destinationPosition === null) {
      throw new Error(`Ship ${this.name} has no destination`);
    }

    return this._destinationPosition;
  }

  resetDestination(): void {
    this._destinationPosition = null;
  }

  setDestination(position: Position) {
    this._destinationPosition = position;
  }

  get isStationary(): boolean {
    return this._destinationPosition === null;
  }
}
