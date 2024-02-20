import Position from "./Position";
import {name} from "ts-jest/dist/transformers/hoist-jest";

export default class Ship {

  private readonly _id: number;
  private readonly _name: string;
  private _currentPosition: Position = new Position(0,0);

  constructor(id: number, name: string, currentPosition: Position) {
    this._id = id;
    this._name = name;
    this._currentPosition = currentPosition;
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
}
