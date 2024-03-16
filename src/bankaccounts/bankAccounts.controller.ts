import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BankaccountsService } from './bankAccounts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { bankAccountDto, updateBankAccountDto } from './bankAccounts.dto';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { User } from 'src/schemas/User.schema';
import mongoose from 'mongoose';

@Controller('bankaccounts')
export class BankAccountsController {
  constructor(private bankAccountsService: BankaccountsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createBankAccount(
    @AuthUser() user: User,
    @Body()
    bankAccountDto: bankAccountDto,
  ) {
    const userId = user._id;
    return await this.bankAccountsService.createBankAccount(
      userId,
      bankAccountDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('get')
  async getAllBankAccounts(@AuthUser() user: User) {
    const userId = user._id;
    return await this.bankAccountsService.getAllBankAccounts(userId);
  }

  @Delete('delete')
  async deleteBankAccount(@Body() _id: string) {
    console.log(_id);
    const deletedAccount =
      await this.bankAccountsService.deleteBankAccount(_id);
    if (!deletedAccount) throw new HttpException('User Not Found', 404);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateBankAccount(
    @Param('id') id: string,
    @Body() updateBankAccountDto: updateBankAccountDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid Id', 400);
    const updatedBankAccount = await this.bankAccountsService.updateBankAccount(
      id,
      updateBankAccountDto,
    );
    if (!updatedBankAccount) throw new HttpException('User Not Found', 404);
    return updatedBankAccount;
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('deposit/:id')
  // async deposit(
  //   @Param('id') id: string,
  //   @Body() trasactionDto: TransactionsDto,
  // ) {
  //   const isValid = mongoose.Types.ObjectId.isValid(id);
  //   if (!isValid) throw new HttpException('Invalid Id', 400);
  //   return await this.bankAccountsService.depositBalance(id, trasactionDto);
  // }
}
