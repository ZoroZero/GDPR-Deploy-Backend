import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AccountsModule } from '../accounts/accounts.module';
import { UsersController } from './users.controller';
import { MailService } from 'src/mail/mail.service';
@Module({
  imports: [TypeOrmModule.forFeature([User]), AccountsModule],
  providers: [UsersService, MailService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
