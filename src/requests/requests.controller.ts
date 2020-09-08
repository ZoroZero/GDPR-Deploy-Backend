import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestsService } from './requests.service';

@Controller('/api/requests')
export class RequestsController {
  constructor(private requestService: RequestsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  getAllRequest(
    @Request() req,
    @Query('PageSize', ParseIntPipe) PageSize: number,
    @Query('PageNumber', ParseIntPipe) PageNumber: number,
    @Query('SortBy') SortBy: string,
    @Query('SortOrder', ParseBoolPipe) SortOrder: boolean,
    @Query('SearchKey') SearchKey: string,
  ) {
    console.log(SearchKey);
    return this.requestService.findAll({
      ...req.user,
      PageSize,
      PageNumber,
      SortBy,
      SortOrder,
      SearchKey,
    });
  }
}
