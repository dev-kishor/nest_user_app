import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileService } from 'src/profile/profile.service';

@ApiTags('Controller_User')
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
  ) {}

  @Post('/signup')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    const { password, email, name, mobile } = createUserDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const userPayload = { ...createUserDto, password: hashedPassword };
    const createUser = await this.usersService.create(userPayload);
    await this.profileService.createNewProfile(createUser?._id);
    return this.authService.signIn(email, password);
  }

  @Get('')
  async getAllUser() {
    const getAllUser = await this.usersService.getAllUserS();
    return getAllUser;
  }
}
