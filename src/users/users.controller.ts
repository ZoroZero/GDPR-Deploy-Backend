import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseFilters,
  SetMetadata,
  Delete,
  Param
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from './role.enum';
import { RoleAuthGuard } from 'src/auth/guards/role-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Reflector } from '@nestjs/core';

@Controller('/api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @SetMetadata('roles', ['admin', 'contact-point'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('')
  getAllProfile(@Request() req) {
    return this.usersService.findAll();
  }

  // @SetMetadata('roles', ['admin', 'contact-point'])
  // @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('/list')
  getListUser(@Request() req) {
    return this.usersService.getListUser(1,5,'','abc',0,null,null);
  }

  @SetMetadata('roles', ['admin', 'contact-point'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Delete('/:UserId')
  deleteUser(@Param('UserId') UserId: string) {
    return this.usersService.deleteUser(UserId,null);
  }
}
