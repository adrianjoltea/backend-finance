import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Transactions {
  @Prop({ required: true })
  amount: number;
  @Prop({ required: true })
  description: string;

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const TransactionsSchema = SchemaFactory.createForClass(Transactions);
