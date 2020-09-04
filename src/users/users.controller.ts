import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseFilters,
  SetMetadata,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
<<<<<<< HEAD
=======
import { Role } from './role.enum';
import { RoleAuthGuard } from 'src/auth/guards/role-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Reflector } from '@nestjs/core';
>>>>>>> 0cf34f3... add check role

@Controller('/api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
<<<<<<< HEAD
=======

  @SetMetadata('roles', ['admin', 'contact-point'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('')
  getAllProfile(@Request() req) {
    return this.usersService.findAll();
  }
>>>>>>> 0cf34f3... add check role
}
