import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
<<<<<<< HEAD

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
=======
import { AuthService } from '../auth.service';
import { request } from 'http';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
>>>>>>> 0cf34f3... add check role
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
<<<<<<< HEAD
    return { userId: payload.id };
=======
    const accountUpdatedDate = await this.authService.validateUserById(
      payload.id,
    );
    if (!accountUpdatedDate || payload.createdDate > accountUpdatedDate) {
      const role = await this.userService.getRoleById(payload.id);
      console.log('Role by JWT stat ', role);
      return { UserId: payload.id, role: String(role) };
    } else {
      throw new UnauthorizedException();
    }
>>>>>>> 0cf34f3... add check role
  }
}
