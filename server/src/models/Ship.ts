import Position from './Position';
import Location from './Location';

export default class Ship {
  private readonly _id: number;
  private readonly _name: string;
  private _currentPosition: Position = new Position(0, 0);
  private _destination: Location | null;

  constructor(
    id: number,
    name: string,
    currentPosition: Position,
    destination: Location | null,
  ) {
    this._id = id;
    this._name = name;
    this._currentPosition = currentPosition;
    this._destination = destination;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get currentPosition(): Position {
    return this._currentPosition;
  }

  set currentPosition(value: Position) {
    this._currentPosition = value;
  }

  get destination(): Location {
    if (this._destination === null) {
      throw new Error('Ship has no destination');
    }

    return this._destination;
  }

  resetDestination(): void {
    this._destination = null;
  }

  get isStationary(): boolean {
    return this._destination === null;
  }
}
