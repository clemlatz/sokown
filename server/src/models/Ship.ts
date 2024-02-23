import Position from './Position';

export default class Ship {
  private readonly _id: number;
  private readonly _name: string;
  private _currentPosition: Position = new Position(0, 0);
  private _destinationPosition: Position | null;

  constructor(
    id: number,
    name: string,
    currentPosition: Position,
    destinationPosition: Position | null,
  ) {
    this._id = id;
    this._name = name;
    this._currentPosition = currentPosition;
    this._destinationPosition = destinationPosition;
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

  get destinationPosition(): Position {
    if (this._destinationPosition === null) {
      throw new Error('Ship has no destination');
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
