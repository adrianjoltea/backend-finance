import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { User } from 'src/schemas/User.schema';
import { TransactionsDto } from './transactions.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('transaction')
  async transaction(
    @AuthUser() user: User,
    @Body()
    transactionDto: TransactionsDto,
  ) {
    const userId = user._id;
    return await this.transactionService.transaction(userId, transactionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get')
  async getTransactions(@AuthUser() user: User) {
    const userId = user._id;
    return await this.transactionService.getTransactions(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteTransactions(@AuthUser() user: User) {
    const userId = user._id;
    return await this.transactionService.deleteTransactions(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/past-transactions/:days')
  async getPastTransactions(
    @AuthUser() user: User,
    @Param('days', ParseIntPipe) days: number,
  ) {
    const userId = user._id;
    return await this.transactionService.getPastTransactions(userId, days);
  }
}
