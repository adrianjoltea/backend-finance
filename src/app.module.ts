import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BankAccountsModule } from './bankaccounts/bankAccounts.module';
import { TransactionModule } from './transactions/transactions.module';
import { InvestModule } from './investing/invest.module';
import { StockModule } from './investing/stock.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://jolteaadrian:PzP87OEH9bio6cjk@finance.7htqjue.mongodb.net/finance',
    ),
    AuthModule,
    BankAccountsModule,
    TransactionModule,
    InvestModule,
    StockModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
