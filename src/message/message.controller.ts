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

  @Get('/by-request/:requestId')
  getAllMessage(@Param('requestId', ParseUUIDPipe) requestId, @Req() req) {
    return this.messageService.getMessageByRequestId(requestId, req.user);
  }

  @Get('/:msgId')
  getMessage(@Param('msgId', ParseUUIDPipe) msgId, @Req() req) {
    console.log('BUGGGG HEREEEE');
    return this.messageService.getMessageByMsgId(msgId, req.user);
  }
}
