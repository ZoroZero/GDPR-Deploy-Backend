import { Controller, Get, Post, Request, UseGuards, UseFilters } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { HttpExceptionFilter } from './filters/http-exception.filter';
@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService
  ) {}

  // @UseGuards(LocalAuthGuard)
  // @UseFilters(new HttpExceptionFilter())
  // @Post('auth/login')
  // async login(@Request() req) {
  //   return this.authService.login(req.user);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

}