import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class BankAccounts {
  @Prop({ required: true, unique: false })
  name: string;

  @Prop({ required: true })
  balance: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ default: '#4f46e5' })
  firstColor: string;

  @Prop({ default: '#312e81' })
  secondColor: string;
}

export const BankAccountsSchema = SchemaFactory.createForClass(BankAccounts);
