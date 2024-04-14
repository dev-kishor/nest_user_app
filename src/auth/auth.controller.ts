import { Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
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
      return res
        .cookie('access_token', token_str, { httpOnly: true })
        .send(token_str);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post("logout")
  async sigout(@Res() res){
    try {
    // TO_DO i'll go to user schema and delete the acces token from there
    // const logout =  this.authService.signOut()
    res.clearCookie("access_token").send();
    } catch (error) {
      
    }
  }
}
