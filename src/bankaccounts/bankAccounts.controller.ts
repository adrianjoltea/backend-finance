import { Body, Controller, Post } from '@nestjs/common';
import { BankaccountsService } from './bankAccounts.service';

@Controller('bankaccounts')
export class BankAccountsController {
  constructor(private bankAccountsService: BankaccountsService) {}

  @Post('create')
  createBankAccount(@Body() bankAccountDto: any) {
    return this.bankAccountsService.createBankAccount(bankAccountDto);
  }
}
