import User from './User';

export type AxysIdTokenClaims = {
  email: string;
  username: string;
};

export default class AuthenticationMethod {
  private readonly _id: number;
  private readonly _externalId: string;
  private readonly _user?: User = null;

  constructor(id: number, externalId: string, user: User = null) {
    this._id = id;
    this._externalId = externalId;
    this._user = user;
  }

  get id(): number {
    return this._id;
  }

  get user(): User {
    return this._user;
  }
}
