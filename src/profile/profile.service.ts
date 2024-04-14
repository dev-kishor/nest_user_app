import { REQUEST } from '@nestjs/core';
import mongoose, { Connection, Error, Model } from 'mongoose';
import { GridFSBucket, MongoClient } from 'mongodb';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './schema/profile.schema';
import { Request } from 'express';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable({ scope: Scope.REQUEST })
export class ProfileService {
  private bucket: GridFSBucket;

  constructor(
    @Inject(REQUEST) private readonly requestObject: any,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    @InjectModel('profileimage')
    private readonly uploadModel: Model<{
      filename: string;
      metadata: { originalname: string };
    }>,
  ) {
    MongoClient.connect('mongodb://localhost:27017/user')
      .then((client) => {
        const db = client.db('user');
        this.bucket = new GridFSBucket(db);
      })
      .catch((err) => console.error(err));
  }

  async createNewProfile(user: string): Promise<any> {
    try {
      return await this.profileModel.create({ user });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateImageS(file: Express.Multer.File): Promise<any> {
    const writeStream = this.bucket.openUploadStream(file.originalname);
    writeStream.end(file.buffer);
    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        resolve(writeStream.id.toString());
        console.log(writeStream);
      });
      writeStream.on('error', (error) => {
        reject(error);
      });
    });
  }

  async followFriendS(userID: any) {
    try {
      const current_logged_user = this.requestObject.user.loggedUser;
      const user = await this.findOneByID(current_logged_user._id);
      const objUserID = new mongoose.Types.ObjectId(userID);
      if (user.following.includes(objUserID)) {
        throw new Error('Already there');
      }
      user.following.push(objUserID);
      await user.save();
      const follwing_user = await this.findOneByID(userID);
      if (follwing_user.followers.includes(user._id)) {
        throw new Error('Already there');
      }
      follwing_user.followers.push(user._id);
      await follwing_user.save();
      return 'done';
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async UnFollowFriendS(userID: any) {
    try {
      const current_logged_user = this.requestObject.user.loggedUser;
      let user = await this.findOneByID(current_logged_user._id);

      if (!user.following.includes(userID)) {
        throw new Error('User not being followed');
      }

      const newFollowing =  user.following.filter((user) => String(user) !== String(userID));
    // user.following = newFollowing
      await user.save();
      const follwing_user = await this.findOneByID(userID);
      if (!follwing_user.followers.includes(user._id)) {
        throw new Error('Already there');
      }
      follwing_user.followers.filter(
        (user) => String(user) !== String(user._id),
      );
      await follwing_user.save();
      return 'done';
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  private async findOneByID(userID: string) {
    const objectId = new mongoose.Types.ObjectId(userID);
    return await this.profileModel.findOne({ user: objectId });
    // .populate('user');
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }

  create(obj: CreateProfileDto) {
    return this.profileModel.create(obj);
    // return `This action removes a #${id} profile`;
  }
}
