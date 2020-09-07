import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Roles } from './users/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get<Reflector>(Reflector);
  app.enableCors();
  app.useGlobalGuards(new Roles(reflector));
  await app.listen(5000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
