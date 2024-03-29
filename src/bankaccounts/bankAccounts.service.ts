import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { BankAccounts } from 'src/schemas/BankAccounts.schema';
import { bankAccountDto, updateBankAccountDto } from './bankAccounts.dto';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class BankaccountsService {
  constructor(
    @InjectModel(BankAccounts.name)
    private bankAccountsModel: Model<BankAccounts>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async createBankAccount(userId: string, bankAccountDto: bankAccountDto) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('User not found', 404);
    const newBankAccount = new this.bankAccountsModel({
      ...bankAccountDto,
      user: userId,
    });
    const savedBankAccount = await newBankAccount.save();
    await findUser.updateOne({
      $push: {
        bankAccounts: savedBankAccount._id,
      },
    });
    return savedBankAccount;
  }

  async getAllBankAccounts(userId: string) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('Bank account not found', 404);
    const { bankAccounts } = await this.userModel
      .findById(userId)
      .populate('bankAccounts');
    return bankAccounts;
  }

  deleteBankAccount(_id: string) {
    return this.bankAccountsModel.findByIdAndDelete(_id);
  }

  updateBankAccount(id: string, updateBankAccountDto: updateBankAccountDto) {
    return this.bankAccountsModel.findByIdAndUpdate(id, updateBankAccountDto, {
      new: true,
    });
  }
}
