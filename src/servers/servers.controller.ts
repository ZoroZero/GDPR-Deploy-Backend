import { Controller, Post, Body, Get, Put, Delete,
    UseInterceptors, UseFilters, UseGuards, Query, ParseUUIDPipe, SetMetadata} from '@nestjs/common';
import { ServersService } from './servers.service';
import { Server } from './server.entity';
import { CreateServerDto } from './dto/create-server-post.dto'
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Reflector } from '@nestjs/core';
import { User } from 'src/auth/user.decorator';
import { GetInterceptor } from '../interceptors/http-get.interceptor';
import { SearchDataDto } from 'src/dto/search.dto';
import { CreateInterceptor } from 'src/interceptors/server/http-create.interceptor';
import { UpdateInterceptor } from 'src/interceptors/server/http-update.interceptor';
import { ExportDto } from './dto/export-server.dto';
import { ChangeStatusListServerDto } from './dto/change-status-list-server.dto';
import { ImportServerDto } from './dto/import-server-list.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';
// import { Request } from 'express';


@Controller('/api/servers')
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
// @UseGuards(JwtAuthGuard)
export class UsersController {

    constructor(private service: ServersService) { }
    @SetMetadata('roles', ['admin', 'dc-member'])
    @Get('all')
    @UseInterceptors(GetInterceptor)
    getAll(){
        return this.service.listAllServer()
    }

    // Get server by pagination, sort, search, filter
    @SetMetadata('roles', ['admin', 'dc-member'])
    @Get('')
    @UseInterceptors(GetInterceptor)
    get(@Query() query: SearchDataDto) {
        //console.log(current);
        return this.service.getServerByPage(query);
    }

    // Get all active server
    @SetMetadata('roles', ['admin', 'dc-member'])
    @Get('active')
    @UseInterceptors(GetInterceptor)
    getActive(){
        //console.log(current);
        return this.service.getAllActiveServer();
    }

    // Get data export by filter
    @SetMetadata('roles', ['admin', 'dc-member'])
    @Get('export')
    @UseInterceptors(GetInterceptor)
    getExportData(@Query() query: ExportDto){
        // console.log('Query', query);
        return this.service.exportServerList(query);
    }

    // // Get csv file
    // @Get('import/:csvpath')
    // seeUploadedFile(@Param('csvpath') file) {
    //     return this.service.importFile(file);
    //     // return res.sendFile(image, { root: './files' });
    // }

    // Create new server
    @SetMetadata('roles', ['admin', 'dc-member'])
    @Post('')
    @UseInterceptors(CreateInterceptor)
    post(@User() user, @Body() body: CreateServerDto){
        // console.log("User:", user);
        return this.service.addNewServer(body, user.UserId)
    }

    // Post csv, xlsx file
    @SetMetadata('roles', ['admin', 'dc-member'])
    @Post('import')
    importServer(@Body(ValidationPipe) body: ImportServerDto){
        console.log("File upload", body);
        return this.service.importServerList(body)
    }

    // Update server
    @SetMetadata('roles', ['admin', 'dc-member'])
    @Put('')
    @UseInterceptors(UpdateInterceptor)
    put(@User() user, @Body() body: Server){
        return this.service.updateServer(body, user.UserId)
    }

    @SetMetadata('roles', ['admin', 'dc-member'])
    @Put('multi')
    updateMulti(@User() user, @Body() body: ChangeStatusListServerDto){
        return this.service.updateMultiServer(body, user.UserId)
    }


    // Delete server
    @SetMetadata('roles', ['admin', 'dc-member'])
    @Delete('')
    @UseInterceptors(UpdateInterceptor)
    deleteServer(@User() user, @Query('id', new ParseUUIDPipe()) id: string) {
        return this.service.deleteServerWithId(id, user.UserId);
    }

    // Delete multiple server
    @SetMetadata('roles', ['admin', 'dc-member'])
    @Delete('multi')
    @UseInterceptors(UpdateInterceptor)
    deleteMultiServer(@User() user, @Query('id') id: string) {
        return this.service.deleteMultiServer(id, user.UserId);
    }

}