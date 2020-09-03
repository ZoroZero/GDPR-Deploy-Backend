import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity'
import { AccountsModule } from './accounts/accounts.module';
@Module({
  imports: [TypeOrmModule.forFeature([User]), AccountsModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}