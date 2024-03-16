import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Invest {
  @Prop({ required: true })
  chance: number;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const InvestSchema = SchemaFactory.createForClass(Invest);
