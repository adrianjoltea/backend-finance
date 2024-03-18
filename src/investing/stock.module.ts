import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BankAccounts,
  BankAccountsSchema,
} from 'src/schemas/BankAccounts.schema';

import { User, UserSchema } from 'src/schemas/User.schema';
import { Auth, AuthSchema } from 'src/schemas/Auth.schema';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import {
  Stock,
  StockBought,
  StockBoughtSchema,
  StockSchema,
} from 'src/schemas/Stock.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { Portofolio, PortofolioSchema } from 'src/schemas/Portofolio.schema';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
        name: Stock.name,
        schema: StockSchema,
      },
      {
        name: Portofolio.name,
        schema: PortofolioSchema,
      },
      {
        name: StockBought.name,
        schema: StockBoughtSchema,
      },
    ]),
  ],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
