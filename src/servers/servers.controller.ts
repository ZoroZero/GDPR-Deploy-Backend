import { Controller, Post, Body, Get, Put, Delete, Param, UploadedFile, UseInterceptors, UseFilters, UseGuards, Query, ParseUUIDPipe, SetMetadata} from '@nestjs/common';
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
import { editFileName, csvFileFilter } from '../helper/helper';
// import { Request } from 'express';


@Controller('/api/servers')
@UseFilters(new HttpExceptionFilter())
// @SetMetadata('roles', ['admin', 'dc-member'])
// @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
// @UseGuards(JwtAuthGuard)
export class UsersController {

    constructor(private service: ServersService) { }

    @Get('')
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

    @Get('export')
    @UseInterceptors(GetInterceptor)
    getExportData(@Query() query: ExportDto){
        // console.log('Query', query);
        return this.service.exportServerList(query);
    }

    @Post('')
    @UseInterceptors(CreateInterceptor)
    post(@User() user, @Body() body: CreateServerDto){
        // console.log("User:", user);
        return this.service.addNewServer(body, user.UserId)
    }


    @Post('import')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
          destination: './files',
          filename: editFileName,
        }),
        fileFilter: csvFileFilter,
    }))
    importServer(@UploadedFile() file){
        // console.log("User:", user);
        const response = {
            originalname: file.originalname,
            filename: file.filename,
          };
          return response;
        // return this.service.importServer(file)
    }

    @Put('')
    @UseInterceptors(UpdateInterceptor)
    put(@User() user, @Body() body: Server){
        return this.service.updateServer(body, user.UserId)
    }

    @Delete('')
    @UseInterceptors(UpdateInterceptor)
    deleteServer(@User() user, @Query('id', new ParseUUIDPipe()) id: string) {
        return this.service.deleteServerWithId(id, user.UserId);
    }



}