import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interface/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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

  async findAll(): Promise<IUser[]> {
    try {
      const allUser = await this.userModel.find({});
      return allUser;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string): Promise<IUser> {
    try {
      const userById = await this.userModel.findById(id);
      return userById;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async passwordUpdate(id: string, password: string): Promise<IUser> {
    try {
      const userById = await this.userModel.findByIdAndUpdate(
        id,
        { password },
        { returnOriginal: false },
      );
      return userById;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  private async checkUserByEmail(email: string): Promise<IUser | null> {
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
}
