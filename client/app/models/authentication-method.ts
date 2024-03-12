import Model, { attr } from '@ember-data/model';

type AxysIdTokenClaims = {
  email: string;
  username: string;
};

export default class AuthenticationMethodModel extends Model {
  @attr declare idTokenClaims: AxysIdTokenClaims;
}
