import { Module } from '@nestjs/common';
import { CustomerServersController } from './customer-servers.controller';
import { CustomerServersService } from './customer-servers.service';

@Module({
  controllers: [CustomerServersController],
  providers: [CustomerServersService]
})
export class CustomerServersModule {}
