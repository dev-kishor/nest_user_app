import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Controller_User')
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    const { password, email, name, mobile } = createUserDto;
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      const userPayload = { ...createUserDto, password: hashedPassword };
      await this.usersService.create(userPayload);
      return this.authService.signIn(email, password);
    } catch (error) {
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }
}
