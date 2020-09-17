import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  SecretKey: any;
  constructor(private readonly authService: AuthService) {
    this.SecretKey = process.env.JWT_SECRET;
  }

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getData();
    if (client.headers && client.headers.Authorization) {
      const authToken: string = client.headers.Authorization;
      const jwtPayload: any = <any>jwt.verify(authToken, this.SecretKey);
      const user = await this.authService.validateUserById_ForWs(jwtPayload.id);
      if (user) {
        context.switchToWs().getData().user = user;
        return Boolean(user);
      } else {
      }
    } else throw new UnauthorizedException();
  }
}
