import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
<<<<<<< HEAD
<<<<<<< HEAD
import { Roles } from './users/roles.guard';
=======
import { ValidationPipe } from '@nestjs/common';
>>>>>>> bcb2900828bb39fd26c0b9e78274c5ee9a020f50

=======
import { RolesGuard } from './auth/guards/role.guard';
>>>>>>> feature/feature_manage_user
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get<Reflector>(Reflector);
  app.enableCors();
<<<<<<< HEAD
<<<<<<< HEAD
  app.useGlobalGuards(new Roles(reflector));
=======
  app.useGlobalPipes(new ValidationPipe());
>>>>>>> bcb2900828bb39fd26c0b9e78274c5ee9a020f50
=======
  // app.useGlobalGuards(new Roles(reflector));
  // app.useGlobalGuards(new RolesGuard(new Reflector()));
>>>>>>> feature/feature_manage_user
  await app.listen(5000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
