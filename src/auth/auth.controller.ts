import { Body, Controller, Post, Res } from '@nestjs/common';
import { LoginDto } from 'src/users/dto/login.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Controller_Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('')
  async signIn(@Body() loginDto: LoginDto, @Res() res: any): Promise<string> {
    try {
      const authToken = await this.authService.signIn(
        loginDto.email,
        loginDto.password,
      );
      const token_str = Object.values(authToken)[0];
      return res.cookie('access_token', token_str,{httpOnly:true}).send(token_str);
    } catch (error) {
      console.log(error);
    }
  }
}
