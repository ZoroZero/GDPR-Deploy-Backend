import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServersService } from './servers.service';
import { Server } from './server.entity';
import { AccountsModule } from '../accounts/accounts.module';
import { UsersController } from './servers.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Server]), AccountsModule],
  providers: [ServersService],
  exports: [ServersService],
  controllers: [UsersController],
})
export class ServersModule {}
