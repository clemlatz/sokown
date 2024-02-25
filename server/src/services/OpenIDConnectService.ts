import { BaseClient, Issuer } from 'openid-client';
import 'dotenv/config';
import { Request } from 'express';

export default class OpenIDConnectService {
  private readonly client: BaseClient;

  constructor(axysIssuer: Issuer) {
    // noinspection JSUnresolvedReference
    this.client = new axysIssuer.Client({
      client_id: process.env.AXYS_CLIENT_ID,
      client_secret: process.env.AXYS_CLIENT_SECRET,
      redirect_uris: [process.env.AXYS_REDIRECT_URI],
    });
  }

  getAuthorizationUrl(state: string): string {
    return this.client.authorizationUrl({
      scope: 'openid email username',
      state,
    });
  }

  async getTokens(request: Request, stateFromCookie: string) {
    const params = this.client.callbackParams(request);
    // noinspection JSUnresolvedReference
    return await this.client.callback(process.env.AXYS_REDIRECT_URI, params, {
      state: stateFromCookie,
    });
  }

  // noinspection JSUnusedGlobalSymbols
  static factory = {
    provide: OpenIDConnectService,
    useFactory: async () => {
      const axysIssuer = await Issuer.discover('https://axys.me');
      return new OpenIDConnectService(axysIssuer);
    },
  };
}
