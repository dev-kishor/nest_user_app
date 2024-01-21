import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BaseDto extends Document {
  @Prop({ default: Date.now })
  createdDate: Date;

  @Prop({ default: Date.now })
  updatedDate: Date;
}

export const BaseDtoSchema = SchemaFactory.createForClass(BaseDto);

BaseDtoSchema.pre('findOneAndUpdate', function (next) {
  const now = new Date();
  this.set({ updatedDate: now });
  next();
});
