import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { HttpExceptionFilter } from './../filters/http-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @UseFilters(new HttpExceptionFilter())
  @Post('login')
  //VALIDATION PIPE -@body? request
  async login(@Request() req) {
    console.log('IN AUTH CONTROLLER AFTER GUARD SUCCESS', req.user);
    return this.authService.login(req.user);
  }
}
