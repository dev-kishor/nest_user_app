import {
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { User, UserDocument } from './schema/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interface/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
}
