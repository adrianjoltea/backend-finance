import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Transactions {
  @Prop({ required: true })
  amount: number;
  @Prop({ required: true })
  description: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date().getTime() })
  createdAtMM: number;

  @Prop()
  userId: string;
}

export const TransactionsSchema = SchemaFactory.createForClass(Transactions);
