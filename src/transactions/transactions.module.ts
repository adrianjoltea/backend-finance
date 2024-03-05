import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from 'src/schemas/User.schema';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import {
  Transactions,
  TransactionsSchema,
} from 'src/schemas/Transactions.schema';
import {
  BankAccounts,
  BankAccountsSchema,
} from 'src/schemas/BankAccounts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Transactions.name,
        schema: TransactionsSchema,
      },
      {
        name: BankAccounts.name,
        schema: BankAccountsSchema,
      },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionModule {}
