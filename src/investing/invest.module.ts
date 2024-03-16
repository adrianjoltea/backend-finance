import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BankAccounts,
  BankAccountsSchema,
} from 'src/schemas/BankAccounts.schema';

import { User, UserSchema } from 'src/schemas/User.schema';
import { Auth, AuthSchema } from 'src/schemas/Auth.schema';
import { InvestService } from './invest.service';
import { Invest, InvestSchema } from 'src/schemas/Invest.schema';
import { InvestController } from './invest.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BankAccounts.name,
        schema: BankAccountsSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Auth.name,
        schema: AuthSchema,
      },
      {
        name: Invest.name,
        schema: InvestSchema,
      },
    ]),
  ],
  controllers: [InvestController],
  providers: [InvestService],
})
export class InvestModule {}
