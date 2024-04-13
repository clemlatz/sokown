import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import AuthenticationMethodRepository from '../repositories/AuthenticationMethodRepository';
import SessionToken from '../models/SessionToken';
import { JsonApiError } from '../errors/JsonApiError';

@Injectable()
export default class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly authenticationMethodRepository: AuthenticationMethodRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { sub, exp } = request.session as SessionToken;

    if (!(await this._authenticationMethodExists(sub))) {
      throw new JsonApiError(
        HttpStatus.UNAUTHORIZED,
        'Unknown authentication method',
      );
    }

    const nowInSeconds = new Date().getTime() / 1000;
    if (exp === undefined || exp < nowInSeconds) {
      throw new JsonApiError(HttpStatus.UNAUTHORIZED, 'Session is expired');
    }

    return true;
  }

  async _authenticationMethodExists(id: number): Promise<boolean> {
    if (id === undefined || id === null) {
      return false;
    }

    const authMethod = await this.authenticationMethodRepository.findById(id);

    if (authMethod === null) {
      return false;
    }

    return authMethod.user !== null;
  }
}
