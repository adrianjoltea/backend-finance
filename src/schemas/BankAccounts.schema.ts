import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class BankAccounts {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  balance: number;

  @Prop({ required: true })
  currency: string;
}

export const BankAccountsSchema = SchemaFactory.createForClass(BankAccounts);
