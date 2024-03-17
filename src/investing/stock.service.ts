import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BankAccounts } from 'src/schemas/BankAccounts.schema';
import { Stock } from 'src/schemas/Stock.schema';
import { User } from 'src/schemas/User.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(BankAccounts.name)
    private bankAccountsModel: Model<BankAccounts>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Stock.name)
    private stockModel: Model<Stock>,
  ) {}

  async create(stockData: Stock): Promise<Stock> {
    const createdStock = new this.stockModel(stockData);
    return await createdStock.save();
  }

  async findAll(): Promise<Stock[]> {
    return await this.stockModel.find().exec();
  }

  @Cron(CronExpression.EVERY_MINUTE)
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
      const updatedValue = Math.max(minValue, newStockValue);

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
