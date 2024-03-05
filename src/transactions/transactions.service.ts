import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transactions } from 'src/schemas/Transactions.schema';
import { TransactionsDto } from './transactions.dto';
import { User } from 'src/schemas/User.schema';
import { BankAccounts } from 'src/schemas/BankAccounts.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transactions.name)
    private transactionModel: Model<Transactions>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(BankAccounts.name)
    private bankAccountsModel: Model<BankAccounts>,
  ) {}

  async transaction(userId: string, transactionDto: TransactionsDto) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('User not found', 404);
    const bankAccount = await this.bankAccountsModel.findById(
      transactionDto.bankAccountId,
    );
    if (!bankAccount) throw new HttpException('Bank account not found', 404);

    const isDeposit = transactionDto.amount > 0;

    const newBalance = isDeposit
      ? bankAccount.balance + transactionDto.amount
      : bankAccount.balance - Math.abs(transactionDto.amount);

    if (!isDeposit && newBalance < 0) {
      throw new HttpException('Insufficent funds', 400);
    }

    await this.bankAccountsModel.findByIdAndUpdate(
      transactionDto.bankAccountId,
      {
        balance: newBalance,
      },
      { new: true },
    );

    const newDeposit = new this.transactionModel({
      ...transactionDto,
      user: userId,
    });
    const savedDeposit = await newDeposit.save();
    await findUser.updateOne({
      $push: {
        transactions: savedDeposit._id,
      },
    });
    return savedDeposit;
  }
  async getTransactions(userId: string) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('User not found', 404);
    const { transactions } = await this.userModel
      .findById(userId)
      .populate('transactions');
    return transactions;
  }
  async deleteTransactions(userId: string) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('User not found', 404);

    await this.userModel.findByIdAndUpdate(userId, {
      $set: { transactions: [] },
    });

    return { message: 'User transactions deleted successfully' };
  }
}
