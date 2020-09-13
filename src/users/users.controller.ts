import {
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
  UseFilters,
  SetMetadata,
  Delete,
  Param,
  Body,
  Query,
  Put,
  HttpException,
  HttpStatus,
  UploadedFile, 
  UseInterceptors,
  Res
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
import { UpdateAccountDto } from 'src/dto/updateAccount.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { editFileName, csvFileFilter, imageFileFilter } from '../helper/helper';
@Controller('/api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/confirm/:id')
  async confirmEmail(@Param('id') id: any, @Response() res) {
    return this.usersService.confirmEmail(id, res);
  }

  @SetMetadata('roles', ['admin', 'contact-point', 'dc-member', 'normal-user'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('/profile')
  async getProfile(@Request() req) {
    const Info = await this.usersService.getInfoById(String(req.user.UserId));
    return {...Info[0], UserId: req.user.UserId};
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

  @SetMetadata('roles', ['admin', 'contact-point','dc-member','normal-user'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Put('/account/:id')
  updateAccount(
    @Request() req1,
    @Param('id') userId: String,
    @Body() req: UpdateAccountDto,
  ) {
    console.log('user', req1.user);
    console.log('BugReq', req.IsActive);
    if (userId==req1.user.UserId){
    return this.usersService.updateAccount(
      userId,
      req.Email,
      req.PassWord,
      req.FirstName,
      req.LastName,
      req1.user.UserId,
      req.IsActive,
    );
    }
    else {
      throw new HttpException("Cannot update! You only can update yourself", HttpStatus.BAD_REQUEST);
    }
  }


  @Post('avatar')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
          destination: './files',
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
    }))
    importUser(@UploadedFile() file){
        // console.log("User:", user);
        const response = {
            originalname: file.originalname,
            filename: file.filename,
          };
          return response;
        // return this.service.importServer(file)
    }


  // @Post('multiple')
  // @UseInterceptors(
  //   FilesInterceptor('image', 20, {
  //     storage: diskStorage({
  //       destination: './files',
  //       filename: editFileName,
  //     }),
  //     fileFilter: imageFileFilter,
  //   }),
  // )
  // async uploadMultipleFiles(@UploadedFiles() files) {
  //   const response = [];
  //   files.forEach(file => {
  //     const fileReponse = {
  //       originalname: file.originalname,
  //       filename: file.filename,
  //     };
  //     response.push(fileReponse);
  //   });
  //   return response;
  // }

  @Get(':imgpath')
seeUploadedFile(@Param('imgpath') image, @Res() res) {
  return res.sendFile(image, { root: './files' });
}

}
