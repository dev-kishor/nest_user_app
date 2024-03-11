import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.checkUserByEmail(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    const loggedUser = { ...user._doc };
    delete loggedUser.password;

    const payload = { loggedUser };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}
