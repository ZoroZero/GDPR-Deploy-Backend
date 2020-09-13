import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
  Post,
  Body,
  Put,
  UseInterceptors,
  HttpCode,
  ParseUUIDPipe,
  SetMetadata,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestsService } from './requests.service';
import { SearchDataDto } from '../dto/search.dto';
import { CreateRequestDto } from './Dto/create-request.dto';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Reflector } from '@nestjs/core';

@UseGuards(JwtAuthGuard)
@Controller('/api/requests')
export class RequestsController {
  constructor(private requestService: RequestsService) {}

  @Get('')
  getAllRequest(@Query() searchQueryDto: SearchDataDto, @Request() req) {
    // console.log(req.user);
    return this.requestService.findAll({
      ...req.user,
      ...searchQueryDto,
    });
  }

  @Post('')
  postNewRequest(@Body() body: CreateRequestDto, @Request() req) {
    return this.requestService.createNewRequest(body, req.user.UserId);
  }

  @SetMetadata('roles', ['admin', 'dc-member'])
  @UseGuards(new RolesGuard(new Reflector()))
  @Put('approve-request')
  approveRequest(@Body('requestId', ParseUUIDPipe) requestId, @Request() req) {
    console.log(requestId);
    return this.requestService.approveRequest(requestId, req.user.UserId);
  }

  @SetMetadata('roles', ['admin', 'dc-member'])
  @UseGuards(new RolesGuard(new Reflector()))
  @Put('cancel-request')
  closeRequest(@Body('requestId', ParseUUIDPipe) requestId, @Request() req) {
    console.log(requestId);
    return this.requestService.closeRequest(requestId, req.user.UserId);
  }

  @Get('/:requestId')
  getRequestDetail(
    @Param('requestId', ParseUUIDPipe) requestId,
    @Request() req,
  ) {
    return this.requestService.getRequestById(requestId, req.user);
  }

  @Put('/:requestId')
  updateRequestDetail(
    @Body() body: CreateRequestDto,
    @Request() req,
    @Param('requestId', ParseUUIDPipe) requestId,
  ) {
    return this.requestService.updateRequestDetail(
      body,
      req.user.UserId,
      requestId,
    );
  }
}
