import { Body, Controller, Get, Post } from '@nestjs/common';
import { StockService } from './stock.service';
import { Stock } from 'src/schemas/Stock.schema';

@Controller('invest')
export class StockController {
  constructor(private stockService: StockService) {}
  @Post()
  create(@Body() stockData: Stock): Promise<Stock> {
    return this.stockService.create(stockData);
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
