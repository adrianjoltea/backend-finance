import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Invest {
  @Prop({ required: true })
  chance: number;

  @Prop({ required: true, min: 0, max: 100 })
  amount: number;
}

export const InvestSchema = SchemaFactory.createForClass(Invest);
