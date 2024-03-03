import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { BankAccounts } from './BankAccounts.schema';
import { Types } from 'mongoose';

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

  // @Prop({
  //   type: [
  //     {
  //       username: { type: String, required: true },
  //       balance: { type: Number, required: true, default: 0 },
  //     },
  //   ],
  //   default: [],
  // })
  // bankAccounts: { username: string; balance: number };
  @Prop({ type: [{ type: Types.ObjectId, ref: 'BankAccounts' }] })
  bankAccounts: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
