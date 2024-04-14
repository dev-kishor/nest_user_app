import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.checkUserByEmail(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const loggedUser = { ...user._doc };
    delete loggedUser.password;

    const payload = { loggedUser };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
    // TO_DO when token is ready store this into user schema
  }

  async signOut() {
    console.log(this.request.headers.cookie);
  }
}
