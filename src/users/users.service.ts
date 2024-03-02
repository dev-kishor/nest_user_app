import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interface/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/users.schema';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<IUser> {
    try {
      const checkEmail = await this.checkUserByEmail(createUserDto.email);
      if (checkEmail) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }
      const createUser = await this.userModel.create(createUserDto);
      return createUser;
    } catch (error) {
      const errorMessage = 'Failed to create user. Please check your input.';
      console.error('User creation error:', error);
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  private async checkUserByEmail(email: string): Promise<any | null> {
    try {
      const checkUser = await this.userModel.findOne({ email });
      return checkUser;
    } catch (error) {
      console.error('Error checking user by email:', error);
      throw new HttpException(
        'Error checking user by email',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async sigin(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    try {
      const userByEmail = await this.checkUserByEmail(email);
      if (!userByEmail) {
        throw new NotFoundException('user not found');
      }
      const passwordMatch = await bcrypt.compare(
        password,
        userByEmail.password,
      );
      if (!passwordMatch) {
        throw new UnauthorizedException();
      }
      const payload = { id: userByEmail._id, username: userByEmail.email };
      const access_token = await this.jwtService.signAsync(payload);
      return { access_token };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

}
