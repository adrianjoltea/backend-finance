import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { BankAccounts } from 'src/schemas/BankAccounts.schema';
import { bankAccountDto, updateBankAccountDto } from './bankAccounts.dto';
import { User } from 'src/schemas/User.schema';
import getMaximumCount from 'src/utils/getMaximumCount';

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

    console.log(findUser);
    const maxBankAccounts = getMaximumCount(findUser.role, 8, 5, 1);

    if (findUser.bankAccounts.length >= maxBankAccounts) {
      throw new HttpException(
        `User already has the maximum number of bank accounts (${maxBankAccounts})`,
        HttpStatus.BAD_REQUEST,
      );
    }

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
