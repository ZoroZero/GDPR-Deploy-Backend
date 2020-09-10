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
import { SearchUserDto } from 'src/dto/searchUser.dto';
import { InsertUserDto } from 'src/dto/insertUser.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';

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
  getListUser(@Query() req: SearchUserDto) {
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
  deleteUser(@Request() req1, @Param('UserId') UserId: string) {
    return this.usersService.deleteUser(UserId, req1.user.UserId);
  }

  @SetMetadata('roles', ['admin', 'contact-point'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Post('/insert')
  insertUser(@Request() req1, @Body() req: InsertUserDto) {
    console.log('BugReq', req);
    return this.usersService.insertUser(
      req.email,
      req.password,
      req.username,
      req.role,
      req.firstname,
      req.lastname,
      req1.user.UserId,
    );
  }

  @SetMetadata('roles', ['admin', 'contact-point'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Put('/:id')
  update(
    @Request() req1,
    @Param('id') userId: String,
    @Body() req: UpdateUserDto,
  ) {
    console.log('user', req1.user);
    console.log('BugReq', req.IsActive);
    return this.usersService.updateUser(
      userId,
      req.email,
      req.password,
      req.username,
      req.role,
      req.firstname,
      req.lastname,
      req1.user.UserId,
      req.IsActive,
    );
  }
}
