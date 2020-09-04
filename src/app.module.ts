import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './users/accounts/accounts.module';

import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/role.guard';
// import { GraphQLModule } from '@nestjs/graphql';
@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule, AccountsModule, UsersModule, ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}