import mongoose from 'mongoose';
import { User } from 'src/users/schema/users.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  @Prop({ type: mongoose.Types.ObjectId, ref: User.name })
  user: mongoose.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: User.name }] })
  followers: [mongoose.Types.ObjectId];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: User.name }] })
  following: [mongoose.Types.ObjectId];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);