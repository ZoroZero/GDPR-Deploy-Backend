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
import { LocalAuthGuard } from './guards/local-auth.guard';
import { HttpExceptionFilter } from './../filters/http-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @UseFilters(new HttpExceptionFilter())
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
