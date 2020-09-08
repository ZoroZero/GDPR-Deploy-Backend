import { Controller, Post, Body, Get, Put, Delete,Param, ParseIntPipe,  UseFilters, UseInterceptors, UseGuards, Query} from '@nestjs/common';
import { ServersService } from './servers.service';
import { Server } from './server.entity';
import { CreateServerDto } from './create-server-post.dto'
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Reflector } from '@nestjs/core';

@Controller('/api/servers')
// @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
export class UsersController {

    constructor(private service: ServersService) { }

    @Get('/all')
    @UseFilters(new HttpExceptionFilter())
    getAll() {
        return this.service.listAllServer();
        // return this.service.getUsers();
    }

    @Get('')
    //get(@Param('current', new ParseIntPipe()) current: number, @Param('pageSize', new ParseIntPipe()) pageSize: number) {
    get(@Query() params) {
        //console.log(current);
        return this.service.getServerByPage(params);
    }

    @Post('')
    post(@Body() body: CreateServerDto){
        return this.service.addNewServer(body)
    }
}