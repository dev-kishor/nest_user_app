import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[UsersModule,
    JwtModule.register({
      global: true,
      secret: 'abc',
      signOptions: { expiresIn: '60s' },
    })],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}