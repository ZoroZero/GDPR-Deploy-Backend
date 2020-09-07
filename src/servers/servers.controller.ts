import { Controller, Post, Body, Get, Put, Delete,Param, ParseUUIDPipe,  UseFilters, UseInterceptors} from '@nestjs/common';
import { ServersService } from './servers.service';
import { Server } from './server.entity';
import { CreateServerDto } from './create-server-post.dto'
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@Controller('/api/servers')
export class UsersController {

    constructor(private service: ServersService) { }

    @Get('')
    @UseFilters(new HttpExceptionFilter())
    getAll() {
        return this.service.listAllServer();
        // return this.service.getUsers();
    }

}