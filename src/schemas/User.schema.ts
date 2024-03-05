import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { BankAccounts } from './BankAccounts.schema';
import mongoose from 'mongoose';
import { BankAccounts } from './BankAccounts.schema';
import { Transactions } from './Transactions.schema';
@Schema()
export class User {
  @Prop()
  _id: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ default: 'user' })
  role: 'user' | 'admin';

  @Prop({ default: 100 })
  balance: number;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BankAccounts' }],
  })
  bankAccounts: BankAccounts[];
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transactions' }],
  })
  transactions: Transactions[];
}

export const UserSchema = SchemaFactory.createForClass(User);
