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
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail/mail.service';
import { MessageModule } from './message/message.module';

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
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.EMAIL_HOST,
          port: Number(process.env.EMAIL_PORT),
          secure: true, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_ID, // generated ethereal user
            pass: process.env.EMAIL_PASS, // generated ethereal password
          },
        },
        defaults: {
          from: '"GDPR" <tu.tran@netpower.no>', // outgoing email ID
        },
        template: {
          dir: process.cwd() + '/template/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    MulterModule.register({
      dest: './files',
    }),
    MessageModule,
  ],

  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
