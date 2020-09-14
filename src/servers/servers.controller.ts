import { Controller, Post, Body, Get, Put, Delete, Param, UploadedFile, Res, 
    UseInterceptors, UseFilters, UseGuards, Query, ParseUUIDPipe, SetMetadata} from '@nestjs/common';
import { ServersService } from './servers.service';
import { Server } from './server.entity';
import { CreateServerDto } from './dto/create-server-post.dto'
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Reflector } from '@nestjs/core';
import { createParamDecorator } from '@nestjs/common';
import { User } from 'src/auth/user.decorator';
import { GetInterceptor } from '../interceptors/http-get.interceptor';
import { SearchDataDto } from 'src/dto/search.dto';
import { CreateInterceptor } from 'src/interceptors/server/http-create.interceptor';
import { UpdateInterceptor } from 'src/interceptors/server/http-update.interceptor';
import { ExportDto } from './dto/export-server.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { editFileName, csvFileFilter, editImportServerFileName } from '../helper/helper';
import { multerOptions } from './config/server.config'

// import { Request } from 'express';


@Controller('/api/servers')
@UseFilters(new HttpExceptionFilter())
@SetMetadata('roles', ['admin', 'dc-member'])
@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
// @UseGuards(JwtAuthGuard)
export class UsersController {

    constructor(private service: ServersService) { }

    // Get server by pagination, sort, search, filter
    @Get('')
    @UseInterceptors(GetInterceptor)
    get(@Query() query: SearchDataDto) {
        //console.log(current);
        return this.service.getServerByPage(query);
    }

    // Get all active server
    @Get('active')
    @UseInterceptors(GetInterceptor)
    getActive(){
        //console.log(current);
        return this.service.getAllActiveServer();
    }

    // Get data export by filter
    @Get('export')
    @UseInterceptors(GetInterceptor)
    getExportData(@Query() query: ExportDto){
        // console.log('Query', query);
        return this.service.exportServerList(query);
    }

    // Get csv file
    @Get('import/:csvpath')
    seeUploadedFile(@Param('csvpath') file) {
        return this.service.importFile(file);
        // return res.sendFile(image, { root: './files' });
    }

    // Create new server
    @Post('')
    @UseInterceptors(CreateInterceptor)
    post(@User() user, @Body() body: CreateServerDto){
        // console.log("User:", user);
        return this.service.addNewServer(body, user.UserId)
    }

    // Post csv, xlsx file
    @Post('import')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    importServer(@User() user, @UploadedFile() file){
        console.log("File upload", file);
        // console.log("Destination", process.env.SERVER_FOLDER)
        const response = {
            originalname: file.originalname,
            filename: file.filename,
        };
        return this.service.importFile(file.filename)
        // return response;
        // return this.service.importServer(file)
    }

    // Update server
    @Put('')
    @UseInterceptors(UpdateInterceptor)
    put(@User() user, @Body() body: Server){
        return this.service.updateServer(body, user.UserId)
    }


    // Delete server
    @Delete('')
    @UseInterceptors(UpdateInterceptor)
    deleteServer(@User() user, @Query('id', new ParseUUIDPipe()) id: string) {
        return this.service.deleteServerWithId(id, user.UserId);
    }


}