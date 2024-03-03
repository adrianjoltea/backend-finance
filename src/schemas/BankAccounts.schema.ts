import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './User.schema';

@Schema()
export class BankAccounts {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: crypto.randomUUID() })
  _id: string;

  @Prop({ required: true })
  balance: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const BankAccountsSchema = SchemaFactory.createForClass(BankAccounts);
