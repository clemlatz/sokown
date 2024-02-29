import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import AuthenticationMethodRepository from '../repositories/AuthenticationMethodRepository';
import { JsonApiError } from '../errors';

@Injectable()
export default class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly authenticationMethodRepository: AuthenticationMethodRepository,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authenticationMethodId, expiresAt } = request.session;

    if (!this._authenticationMethodExists(authenticationMethodId)) {
      throw new JsonApiError(
        HttpStatus.UNAUTHORIZED,
        'Unknown authentication method',
      );
    }

    const now = new Date().getTime();
    if (expiresAt === undefined || expiresAt < now) {
      throw new JsonApiError(HttpStatus.UNAUTHORIZED, 'Session is expired');
    }

    return true;
  }

  _authenticationMethodExists(id: number): boolean | Promise<boolean> {
    if (id === undefined) {
      return false;
    }

    return this.authenticationMethodRepository.existsById(id);
  }
}
