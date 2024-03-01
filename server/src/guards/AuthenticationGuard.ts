import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import AuthenticationMethodRepository from '../repositories/AuthenticationMethodRepository';
import { JsonApiError } from '../errors';
import SessionToken from '../models/SessionToken';

@Injectable()
export default class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly authenticationMethodRepository: AuthenticationMethodRepository,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { sub, exp } = request.session as SessionToken;

    if (!this._authenticationMethodExists(sub)) {
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

  _authenticationMethodExists(id: number): boolean | Promise<boolean> {
    if (id === undefined || id === null) {
      return false;
    }

    return this.authenticationMethodRepository.existsById(id);
  }
}
