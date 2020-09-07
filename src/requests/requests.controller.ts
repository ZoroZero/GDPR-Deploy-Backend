import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestsService } from './requests.service';

@Controller('/api/requests')
export class RequestsController {
  constructor(private requestService: RequestsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  getAllRequest(@Request() req) {
    return this.requestService.findAll({ ...req.user });
  }
}
