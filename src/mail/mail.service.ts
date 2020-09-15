import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

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
        from: 'hdkhang1504@outlook.com', // Senders email address
        subject: 'GDPR new request ✔', // Subject line
        template: 'index',
        context: {
          username: username,
          content: content,
        },
      })
      .then(success => {
        console.log(success);
      })
      .catch(err => {
        console.log(err);
      });
  }

  public example2(): void {
    this.mailerService
      .sendMail({
        to: 'hdkhang1504@gmail.com', // List of receivers email address
        from: 'hdkhang1504@outlook.com', // Senders email address
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
        from: 'noreply@nestjs.com',
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
