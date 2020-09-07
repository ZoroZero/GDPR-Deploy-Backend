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
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    UsersModule,
    PassportModule,
    AccountsModule,
<<<<<<< HEAD
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60000s' },
    }),
=======
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
>>>>>>> bcb2900828bb39fd26c0b9e78274c5ee9a020f50
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
