const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export default class SessionToken {
  public readonly iss = 'https://sokown.ltzr.io';
  public readonly aud = 'https://sokown.ltzr.io';
  public readonly sub: number;
  public readonly iat: number;
  public readonly exp: number;
  public readonly state: string;

  constructor({ sub = null, state = null, duration = ONE_DAY_IN_SECONDS }) {
    this.sub = sub;
    this.state = state;
    this.iat = Math.floor(Date.now() / 1000);
    this.exp = this.iat + duration;
  }

  writeTo(target: object) {
    Object.assign(target, this);
  }
}
