import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AppService } from './app.service';
// import { LocalAuthGuard } from './auth/guards/local-auth.guard';
// import { HttpExceptionFilter } from './filters/http-exception.filter';
@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly appService: AppService,
  ) {}

  // @UseGuards(LocalAuthGuard)
  // @UseFilters(new HttpExceptionFilter())
  // @Post('auth/login')
  // async login(@Request() req) {
  //   return this.authService.login(req.user);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
  @Get()
  sendMail(): any {
    return this.appService.example();
  }

  @Get('template')
  sendTemplate(): any {
    return this.appService.example2();
  }
}
