import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BankAccounts } from 'src/schemas/BankAccounts.schema';
import { Invest } from 'src/schemas/Invest.schema';
import { User } from 'src/schemas/User.schema';
import { createInvestitiondto, investDto } from './invest.dto';

@Injectable()
export class InvestService {
  private rewardMap = {
    60: () => Math.floor(Math.random() * (11 - 7 + 1)) + 7,
    40: () => Math.floor(Math.random() * (20 - 15 + 1)) + 15,
    25: () => Math.floor(Math.random() * (25 - 21 + 1)) + 21,
  };

  private loseStreak: number = 0;

  constructor(
    @InjectModel(BankAccounts.name)
    private bankAccountsModel: Model<BankAccounts>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Invest.name)
    private investModel: Model<Invest>,
  ) {}

  async handleInvest(
    userId: string,
    { chance, amount, bankAccountId }: investDto,
  ) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('User not found', 404);

    const bankAccount = await this.bankAccountsModel.findById(bankAccountId);
    if (!bankAccount) throw new HttpException('Bank account not found', 404);

    const random = Math.random() * 100;

    const rewardPercent = this.rewardMap[chance] ? this.rewardMap[chance]() : 0;
    console.log(rewardPercent);

    if (random <= chance + this.loseStreak) {
      const winningBonus = (amount * rewardPercent) / 100;
      const winnings = amount + winningBonus;
      this.loseStreak = 0;
      const balaceUpdate = (bankAccount.balance += winnings);
      await bankAccount.save();
      return { win: true, winnings, balaceUpdate };
    } else {
      const loses = amount;
      this.loseStreak += 5;
      const balaceUpdate = (bankAccount.balance -= loses);
      await bankAccount.save();
      return { win: false, loses, balaceUpdate };
    }
  }

  async createInvestition(createInvestitiondto: createInvestitiondto) {
    const newInvestition = new this.investModel({
      ...createInvestitiondto,
    });

    return await newInvestition.save();
  }
  async getAllInvestitions() {
    return await this.investModel.find().exec();
  }
  async deleteInvestion(_id: string) {
    return await this.investModel.findByIdAndDelete(_id);
  }
}
