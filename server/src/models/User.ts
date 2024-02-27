export default class User {
  private readonly _id: number;
  private readonly _pilotName: string;

  constructor(id: number, pilotName: string) {
    this._id = id;
    this._pilotName = pilotName;
  }

  get id(): number {
    return this._id;
  }

  get pilotName(): string {
    return this._pilotName;
  }
}
