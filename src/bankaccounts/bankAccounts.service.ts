import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BankAccounts } from 'src/schemas/BankAccounts.schema';

@Injectable()
export class BankaccountsService {
  constructor(
    @InjectModel(BankAccounts.name)
    private bankAccountsModel: Model<BankAccounts>,
  ) {}

  async createBankAccount(bankAccountDto: any) {
    return new this.bankAccountsModel(bankAccountDto).save();
  }
}
