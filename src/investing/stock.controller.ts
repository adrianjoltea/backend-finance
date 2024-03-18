import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { Stock } from 'src/schemas/Stock.schema';
import { BoughtStock } from './stock.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { User } from 'src/schemas/User.schema';

@Controller('invest')
export class StockController {
  constructor(private stockService: StockService) {}
  @Post()
  create(@Body() stockData: Stock): Promise<Stock> {
    return this.stockService.create(stockData);
  }

  @Post('add-stock')
  @UseGuards(JwtAuthGuard)
  async addStock(@Body() stockData: BoughtStock, @AuthUser() user: User) {
    const userId = user._id;
    return await this.stockService.buyStock(userId, stockData);
  }

  @Get()
  findAll(): Promise<Stock[]> {
    return this.stockService.findAll();
  }

  @Get('update')
  async updateStockValuesManually() {
    await this.stockService.updateStockValues();
    return { message: 'Stock values updated successfully' };
  }
}
