import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesGuard } from './auth/guards/role.guard';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get<Reflector>(Reflector);
  app.enableCors();
  // app.useGlobalGuards(new Roles(reflector));
  // app.useGlobalGuards(new RolesGuard(new Reflector()));
  await app.listen(5000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
