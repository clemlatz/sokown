import User from './User';

export type AxysIdTokenClaims = {
  email: string;
  username: string;
};

export default class AuthenticationMethod {
  private readonly _id: number;
  private readonly _idTokenClaims: AxysIdTokenClaims;
  private readonly _user?: User = null;

  constructor(id: number, idTokenClaims: AxysIdTokenClaims, user: User = null) {
    this._id = id;
    this._idTokenClaims = idTokenClaims;
    this._user = user;
  }

  get id(): number {
    return this._id;
  }

  get idTokenClaims(): AxysIdTokenClaims {
    return this._idTokenClaims;
  }

  get user(): User {
    return this._user;
  }
}
