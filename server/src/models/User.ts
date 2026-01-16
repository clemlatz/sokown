export default class User {
  private readonly _id: number;
  private readonly _pilotName: string;
  private readonly _email: string;
  private readonly _hasEnabledNotifications: boolean;

  constructor(
    id: number,
    pilotName: string,
    email: string,
    hasEnabledNotifications: boolean,
  ) {
    this._id = id;
    this._pilotName = pilotName;
    this._email = email;
    this._hasEnabledNotifications = hasEnabledNotifications;
  }

  get id(): number {
    return this._id;
  }

  get pilotName(): string {
    return this._pilotName;
  }

  get email(): string {
    return this._email;
  }

  get hasEnabledNotifications(): boolean {
    return this._hasEnabledNotifications;
  }
}
