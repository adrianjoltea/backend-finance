import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BankAccounts } from 'src/schemas/BankAccounts.schema';
import { Stock, StockBought } from 'src/schemas/Stock.schema';
import { User } from 'src/schemas/User.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BoughtStock, SellStock } from './stock.dto';
import { Portofolio } from 'src/schemas/Portofolio.schema';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(BankAccounts.name)
    private bankAccountsModel: Model<BankAccounts>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Stock.name)
    private stockModel: Model<Stock>,
    @InjectModel(Portofolio.name)
    private portofolioModel: Model<Portofolio>,
    @InjectModel(StockBought.name)
    private boughtStockModel: Model<StockBought>,
  ) {}

  async create(stockData: Stock): Promise<Stock> {
    const createdStock = new this.stockModel(stockData);
    return await createdStock.save();
  }

  async findAll(): Promise<Stock[]> {
    return await this.stockModel.find().exec();
  }

  async buyStock(userId: string, stockData: BoughtStock) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('User not found', 404);
    const stock = await this.stockModel.findById(stockData._id);
    if (!stock) throw new HttpException('Stock not found', 404);

    const newStock = new this.boughtStockModel({
      amount: stockData.amount,
      boughtPrice: stock.currentValue,
      user: userId,
    });
    console.log(newStock);
    const savedStock = await newStock.save();
    console.log(savedStock);
    const userPortofolioId = (await this.userModel.findById(userId)).portofolio;
    const userPortofolio =
      await this.portofolioModel.findById(userPortofolioId);

    await userPortofolio.updateOne({
      $push: {
        stocks: savedStock._id,
      },
    });
    return { succes: true, newStock };
  }

  async sellStocks(userId: string, sellData: SellStock) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('User not found', 404);

    const findStock = await this.boughtStockModel.findByIdAndDelete(
      sellData._id,
    );

    const bankAccount = await this.bankAccountsModel.findById(sellData.cardId);
    console.log(bankAccount);
    const newBalance =
      sellData.amount * sellData.sellPrice + bankAccount.balance;
    console.log(newBalance);
    console.log(findStock);

    await this.bankAccountsModel.findByIdAndUpdate(
      sellData.cardId,
      {
        balance: newBalance,
      },
      {
        new: true,
      },
    );
    return {
      succes: true,
    };
  }

  async getUsersStocks(userId: string) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('User not found', 404);

    const userPortfolioId = findUser.portofolio;

    const userPortfolio = await this.portofolioModel
      .findById(userPortfolioId)
      .populate('stocks', '-__v');
    console.log(userPortfolio);

    return userPortfolio.stocks;
  }

  @Cron(CronExpression.EVERY_10_HOURS)
  async updateStockValues(): Promise<void> {
    const stocks = await this.stockModel.find().exec();

    for (const stock of stocks) {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(stock._id);
      if (!isValidObjectId) {
        console.error(`Invalid ObjectId: ${stock._id}`);
        continue;
      }

      const previousValue = stock.currentValue;
      const updatedPreviousValues = [...stock.previousValue, previousValue];
      console.log(updatedPreviousValues, previousValue);
      const fluctuationPercentage = (Math.random() * 10 - 5) / 10;
      console.log(fluctuationPercentage);
      const newStockValue = stock.currentValue * (1 + fluctuationPercentage);
      const minValue = 0;
      const updatedValue = Math.max(minValue, +newStockValue.toFixed(2));

      try {
        await this.stockModel
          .findByIdAndUpdate(stock._id, {
            currentValue: updatedValue,
            previousValue: updatedPreviousValues,
          })
          .exec();
      } catch (error) {
        console.error(`Error updating stock with ID ${stock._id}: ${error}`);
      }
    }
  }
}
