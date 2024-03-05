import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { User } from 'src/schemas/User.schema';
import { TransactionsDto } from './transactions.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('transaction/:id')
  async transaction(
    @AuthUser() user: User,
    @Body()
    transactionDto: TransactionsDto,
    @Param('id') id: string,
  ) {
    const userId = user._id;
    return await this.transactionService.transaction(
      userId,
      id,
      transactionDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('get')
  async getTransactions(@AuthUser() user: User) {
    const userId = user._id;
    return await this.transactionService.getTransactions(userId);
  }
}
