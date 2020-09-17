import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MessageService } from './message.service';

@UseGuards(JwtAuthGuard)
@Controller('api/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/:requestId')
  getAllMessage(@Param('requestId', ParseUUIDPipe) requestId, @Req() req) {
    return this.messageService.getMessageByRequestId(requestId, req.user);
  }
}
