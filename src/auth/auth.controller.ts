import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseFilters,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { LoggingService } from 'src/logger/logging.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private myLogger: LoggingService
  ) {}

  @UseGuards(LocalAuthGuard)
  @UseFilters(new HttpExceptionFilter())
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

}