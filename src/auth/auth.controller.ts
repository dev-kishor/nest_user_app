import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/users/dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Controller_Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post("")
    signIn(@Body() loginDto: LoginDto){
      return  this.authService.signIn(loginDto.email,loginDto.password)
    }
}
