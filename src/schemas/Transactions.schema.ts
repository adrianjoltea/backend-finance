import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Transactions {
  @Prop({ required: true })
  amount: number;
  @Prop({ required: true })
  description: string;
}

export const TransactionsSchema = SchemaFactory.createForClass(Transactions);
