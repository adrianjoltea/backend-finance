import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BankAccounts,
  BankAccountsSchema,
} from 'src/schemas/BankAccounts.schema';
import { BankAccountsController } from './bankAccounts.controller';
import { BankaccountsService } from './bankAccounts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BankAccounts.name,
        schema: BankAccountsSchema,
      },
    ]),
  ],
  controllers: [BankAccountsController],
  providers: [BankaccountsService],
})
export class BankAccountsModule {}
