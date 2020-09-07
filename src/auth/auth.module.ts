import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AccountsModule } from 'src/accounts/accounts.module';
import { AuthController } from './auth.controller';
<<<<<<< HEAD
import { LoggingModule } from 'src/logger/logging.module';

=======
import { ConfigModule, ConfigService } from '@nestjs/config';
>>>>>>> 3e13aaefb371bb3a7daebe7331cbacbd1662738c
@Module({
  imports: [
    UsersModule,
    PassportModule,
    AccountsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),      
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      })
    })
    // JwtModule.register({
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '60000s' },
    // }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
