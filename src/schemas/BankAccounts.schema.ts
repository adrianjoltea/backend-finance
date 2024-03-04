import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class BankAccounts {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  balance: number;
}

export const BankAccountsSchema = SchemaFactory.createForClass(BankAccounts);
