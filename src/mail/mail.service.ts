import { MailerService } from '@nestjs-modules/mailer';
import { Repository, getConnection } from 'typeorm';
import { Subject } from 'rxjs';
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  getHello(): string {
    return 'Hello World!';
  }

  public notifyNewRequest(
    username,
    listmail: Array<string>,
    content: string,
  ): void {
    listmail.push('hdkhang1504@gmail.com');
    this.mailerService
      .sendMail({
        to: listmail, // List of receivers email address
        from: process.env.EMAIL_SEND, // Senders email address
        subject: 'GDPR new request ✔', // Subject line
        template: 'index',
        context: {
          username: username,
          content: content,
        },
      })
      .then(success => {
        console.log('success', success);
        this.logEmail(listmail.join(','), content, 'GDPR new request ✔');
      })
      .catch(err => {
        console.log(err);
      });
  }

  public confirmNewAccount(username, password, link, tomail: string): void {
    // tmail.push('hdkhang1504@gmail.com');
    this.mailerService
      .sendMail({
        to: tomail, // List of receivers email address
        from: process.env.EMAIL_SEND, // Senders email address
        subject: 'GDPR new account ✔', // Subject line
        template: 'confirmemail',
        context: {
          username: username,
          password: password,
          link: link,
        },
      })
      .then(success => {
        console.log('success', success);
        this.logEmail(
          tomail,
          `Your new username: ${username}; Your new password: ${password}; Please click link to confirm!`,
          'GDPR new account ✔',
        );
      })
      .catch(err => {
        console.log(err);
      });
  }

  public forgotPasswordEmail(username, password, tomail: string): void {
    // tmail.push('hdkhang1504@gmail.com');
    this.mailerService
      .sendMail({
        to: tomail, // List of receivers email address
        from: process.env.EMAIL_SEND, // Senders email address
        subject: 'GDPR FORGOT PASSWORD ✔', // Subject line
        template: 'forgotpasswordemail',
        context: {
          username: username,
          password: password,
        },
      })
      .then(success => {
        console.log('success', success);
        this.logEmail(
          tomail,
          `Your username: ${username}; Your new password: ${password};`,
          'GDPR FORGOT PASSWORD ✔',
        );
      })
      .catch(err => {
        console.log(err);
      });
  }

  public logEmail(listmail: string, content: string, subject: string): void {
    console.log('Email da log');
    getConnection()
      .manager.query(
        `EXECUTE [dbo].[insertEmailLog]   
      @Subject ='${subject}'
      ,@Receiver='${listmail}'
      ,@Status=${1}
      ,@Body='${content}'`,
      )
      .catch(err => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
  }

  public example2(): void {
    this.mailerService
      .sendMail({
        to: 'hdkhang1504@gmail.com', // List of receivers email address
        from: 'tu.tran@netpower.no', // Senders email address
        subject: 'Testing Nest Mailermodule with template ✔',
        template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'john doe',
        },
      })
      .then(success => {
        console.log(success);
      })
      .catch(err => {
        console.log(err);
      });
  }

  public example3(): void {
    this.mailerService
      .sendMail({
        to: 'test@nestjs.com',
        from: 'tu.tran@netpower.no',
        subject: 'Testing Nest Mailermodule with template ✔',
        template: __dirname + '/index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'john doe',
        },
      })
      .then(success => {
        console.log(success);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
