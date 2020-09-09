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
import { SearchDataDto } from '../dto/search.dto';

@UseGuards(JwtAuthGuard)
@Controller('/api/requests')
export class RequestsController {
  constructor(private requestService: RequestsService) {}

  @Get('')
  getAllRequest(@Query() searchQueryDto: SearchDataDto, @Request() req) {
    console.log(req.user);
    return this.requestService.findAll({
      ...req.user,
      ...searchQueryDto,
    });
  }
}
