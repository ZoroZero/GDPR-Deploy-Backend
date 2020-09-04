import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { AuthService } from '../auth.service';
import { request } from 'express';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
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
    console.log(
      'jwt strategy validate => account updated date',
      accountUpdatedDate,
    );
    if (!accountUpdatedDate || payload.createdDate > accountUpdatedDate) {
      return { UserId: payload.id };
    } else {
      console.log('payload');
      console.log(payload);
      throw new UnauthorizedException();
    }
  }
}
