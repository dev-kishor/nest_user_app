import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument =  User & Document

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ required: true, index: true, unique: true,trim:true,lowercase:true })
  email: string;

  @Prop()
  password: string;

  @Prop({type:Boolean,default:true})
  isActive:boolean
}

export const UserSchema = SchemaFactory.createForClass(User)