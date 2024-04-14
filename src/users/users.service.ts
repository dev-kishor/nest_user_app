import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { User, UserDocument } from './schema/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(REQUEST) private readonly requestObject: any,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<any> {
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

  async checkUserByEmail(email: string): Promise<any | null> {
    try {
      const checkUser = await this.userModel.findOne({ email }).exec();
      return checkUser;
    } catch (error) {
      console.error('Error checking user by email:', error);
      throw new HttpException(
        'Error checking user by email',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllUserS() {
    const current_logged_user = this.requestObject.user.loggedUser;
    try {
      return await this.userModel.find({
        _id: { $ne: current_logged_user._id },
      });

    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
