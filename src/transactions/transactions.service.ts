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
      userId,
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

  async getPastTransactions(userId: string, days: number) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('User not found', 404);

    const currentDate = new Date();

    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - days);

    const transactions = await this.transactionModel
      .find({
        userId,
        createdAt: { $gte: startDate, $lt: currentDate },
      })
      .sort({ createdAt: 1 })
      .exec();

    const result = transactions.reduce((acc, transaction) => {
      const dayKey = transaction.createdAt.toISOString().split('T')[0];
      const existingDay = acc[dayKey];

      if (existingDay) {
        existingDay.income += transaction.amount > 0 ? transaction.amount : 0;
        existingDay.expense += transaction.amount < 0 ? -transaction.amount : 0;
      } else {
        acc[dayKey] = {
          day: transaction.createdAt.toISOString().split('T')[0],
          income: transaction.amount > 0 ? transaction.amount : 0,
          expense: transaction.amount < 0 ? -transaction.amount : 0,
        };
      }

      return acc;
    }, {});

    return Object.values(result);
  }
  async generateAndInsertSampleTransactions(
    userId: string,
    count: number,
  ): Promise<void> {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('User not found', 404);

    // const bankAccount = await this.bankAccountsModel.findOne({ user: userId });
    // if (!bankAccount) throw new HttpException('Bank account not found', 404);

    const categories = [
      'job',
      'side job',
      'freelancing',
      'other',
      'miscellaneous',
      'travel',
      'entertainment',
      'groceries',
      'utilities',
    ];

    const sampleTransactions = Array.from({ length: count }, () => {
      const isDeposit = Math.random() > 0.5;
      const amount = isDeposit
        ? Math.round(Math.random() * 100)
        : -Math.round(Math.random() * 100);
      const category =
        categories[Math.floor(Math.random() * categories.length)];

      return {
        user: findUser,
        userId,
        amount,
        description: 'Sample Transaction',
        category,
        createdAt: new Date(),
      };
    });

    const insertedTransactions =
      await this.transactionModel.insertMany(sampleTransactions);

    const transactionIds = insertedTransactions.map(
      (transaction) => transaction._id,
    );

    await findUser.updateOne({
      $push: {
        transactions: { $each: transactionIds },
      },
    });
  }
}
