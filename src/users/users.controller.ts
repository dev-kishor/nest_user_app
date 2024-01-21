import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { IUser } from './interface/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Controller_Users")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    try {
      return this.usersService.create(createUserDto);
    } catch (error) {
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll():Promise<IUser[]> {
    try {
      return this.usersService.findAll();
    } catch (error) {
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string):Promise<IUser> {
    try {
      return this.usersService.findOne(id);
    } catch (error) {
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('/change-password/:id')
  update(
    @Param('id') id: string,
    @Body() UpdateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    const { password } = UpdateUserPasswordDto;
    try {
      if (password) {
        return this.usersService.passwordUpdate(id, password);
      }
    } catch (error) {
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }
}
