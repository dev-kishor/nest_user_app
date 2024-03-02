import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { IUser } from './interface/users.interface';
import { ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@ApiTags('Controller_Auth')
@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    const { password, email, name } = createUserDto;
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      const userPayload = { ...createUserDto, password: hashedPassword };
      await this.usersService.create(userPayload);
      return { password, email, name };
    } catch (error) {
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{access_token:string}> {    
    const { email, password } = loginDto;
    try {
      return this.usersService.sigin({ email, password });
    } catch (error) {
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }
}
