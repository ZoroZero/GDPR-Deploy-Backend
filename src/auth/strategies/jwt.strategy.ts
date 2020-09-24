import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { AuthService } from '../auth.service';
import { request } from 'http';
import { UsersService } from 'src/users/users.service';
import { date } from '@hapi/joi';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
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
