import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { BaseDto } from 'src/common/schemas/base.schema';

export type TodoDocument = Todo & Document;

// @Schema({ timestamps: true })
@Schema()
export class Todo extends BaseDto {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, trim: true })
  todo: string;

  // True:- active
  // False:- inactive
  @Prop({ type: Boolean, default: true })
  todoStatus: boolean;

  // True:- Deleted
  // False:- no
  @Prop({ type: Boolean, default: false })
  isDelete: boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
