import User from './User';

export default class AuthenticationMethod {
  private readonly _id: number;
  private readonly _externalId: string;
  private readonly _user: User;

  constructor(id: number, externalId: string, user: User) {
    this._id = id;
    this._externalId = externalId;
    this._user = user;
  }

  get id(): number {
    return this._id;
  }

  get externalId(): string {
    return this._externalId;
  }

  get user(): User {
    return this._user;
  }
}
