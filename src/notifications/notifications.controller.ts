import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Request,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get('')
  getAllNotification(@Request() req) {
    return this.notificationsService.findAll(req.user);
  }

  @Put('/read-notification/:notifId')
  readNotification(@Request() req, @Param('notifId', ParseUUIDPipe) notifId) {
    return this.notificationsService.setNotificationIsRead(notifId, req.user);
  }
}
