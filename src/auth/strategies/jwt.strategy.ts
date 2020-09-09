import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { AuthService } from '../auth.service';
import { request } from 'http';
import { UsersService } from 'src/users/users.service';
import { date } from '@hapi/joi';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const accountUpdatedDate = await this.authService.validateUserById(
      payload.id,
    );
    if (new Date(payload.createdDate) > accountUpdatedDate) {
      const role = await this.userService.getRoleById(payload.id);
      return { UserId: payload.id, role: String(role) };
    } else {
      throw new UnauthorizedException();
    }
  }
}
