import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseFilters,
  SetMetadata,
  Delete,
  Param,
  Body,
  Query,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from './role.enum';
import { RoleAuthGuard } from 'src/auth/guards/role-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Reflector } from '@nestjs/core';
import { request } from 'express';

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

  @SetMetadata('roles', ['admin', 'contact-point'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('/list')
  getListUser(@Query() req) {
    console.log(req);
    return this.usersService.getListUser(
      req.PageNo,
      req.PageSize,
      req.SearchKey,
      req.SortBy,
      req.SortOrder,
      req.Role,
      req.IsActive,
    );
  }

  @SetMetadata('roles', ['admin', 'contact-point'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Delete('/:UserId')
  deleteUser(@Param('UserId') UserId: string) {
    return this.usersService.deleteUser(UserId, null);
  }

  @SetMetadata('roles', ['admin', 'contact-point'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Post('/insert')
  insertUser(@Body() req) {
    console.log('BugReq', req);
    return this.usersService.insertUser(
      req.email,
      req.password,
      req.username,
      req.role[0],
      req.firstname,
      req.lastname,
      req.createdby,
    );
  }

  @SetMetadata('roles', ['admin', 'contact-point'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Put('/:id')
  update(@Param('id') userId: String, @Body() req) {
    console.log('BugReq', req);
    return this.usersService.updateUser(
      userId,
      req.email,
      req.password,
      req.username,
      req.role[0],
      req.firstname,
      req.lastname,
      req.updatedby,
    );
  }
}
