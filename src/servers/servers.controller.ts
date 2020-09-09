import { Controller, Post, Body, Get, Put, Delete,Param, UseInterceptors, UseFilters, UseGuards, Query, ParseUUIDPipe} from '@nestjs/common';
import { ServersService } from './servers.service';
import { Server } from './server.entity';
import { CreateServerDto } from './create-server-post.dto'
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Reflector } from '@nestjs/core';
import { createParamDecorator } from '@nestjs/common';
import { User } from 'src/auth/user.decorator';
import { GetInterceptor } from '../interceptors/http-get.interceptor';
import { SearchDataDto } from 'src/dto/search.dto';
// import { Request } from 'express';


@Controller('/api/servers')
// @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
@UseGuards(JwtAuthGuard)
export class UsersController {

    constructor(private service: ServersService) { }

    // @Get('/all')
    // @UseFilters(new HttpExceptionFilter())
    // getAll() {
    //     return this.service.listAllServer();
    //     // return this.service.getUsers();
    // }

    @Get('')
    @UseFilters(new HttpExceptionFilter())
    @UseInterceptors(GetInterceptor)
    get(@Query() query: SearchDataDto) {
        //console.log(current);
        return this.service.getServerByPage(query);
    }

    @Get('active')
    @UseInterceptors(GetInterceptor)
    getActive(){
        //console.log(current);
        return this.service.getAllActiveServer();
    }

    @Post('')
    post(@User() user, @Body() body: CreateServerDto){
        // console.log("User:", user);
        return this.service.addNewServer(body, user.UserId)
    }

    @Put('')
    put(@User() user, @Body() body: Server){
        return this.service.updateServer(body, user.UserId)
    }

    @Delete('')
    deleteServer(@User() user, @Query('id', new ParseUUIDPipe()) uuid: string) {
        return this.service.deleteServerWithId(uuid, user.UserId);
    }
}