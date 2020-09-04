import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { RolesGuard } from './auth/guards/role.guard';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // app.useGlobalGuards(new Roles(reflector));
  // app.useGlobalGuards(new RolesGuard(new Reflector()));

  await app.listen(5000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();