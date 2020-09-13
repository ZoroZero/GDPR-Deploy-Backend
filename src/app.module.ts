import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';
import { MulterModule } from '@nestjs/platform-express';
import { CustomersModule } from './customers/customers.module';

import { ServersModule } from './servers/servers.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    AccountsModule,
    CustomersModule,
    UsersModule,
    ServersModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    RequestsModule,
    MulterModule.register({
      dest: './files',
    })
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
