import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class profileImage {
  _id: String;
  filename: String;
  metadata: Object;
  chunkSize: Number;
  length: Number;
  uploadDate: Date;
}

export const profileImageSchema = SchemaFactory.createForClass(profileImage);
