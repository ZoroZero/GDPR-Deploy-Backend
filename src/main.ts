import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get<Reflector>(Reflector);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.BACKEND_PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
