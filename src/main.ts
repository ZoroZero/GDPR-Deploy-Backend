import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
<<<<<<< HEAD
import { Roles } from './users/roles.guard';
=======
import { ValidationPipe } from '@nestjs/common';
>>>>>>> bcb2900828bb39fd26c0b9e78274c5ee9a020f50

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get<Reflector>(Reflector);
  app.enableCors();
<<<<<<< HEAD
  app.useGlobalGuards(new Roles(reflector));
=======
  app.useGlobalPipes(new ValidationPipe());
>>>>>>> bcb2900828bb39fd26c0b9e78274c5ee9a020f50
  await app.listen(5000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
