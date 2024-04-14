import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProgramDocument = Program & Document;

@Schema()
export class Program {
  @Prop({ type: String })
  collectionName: string;

  @Prop({ type: Boolean })
  logable: boolean;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
