import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransactionsDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  bankAccountId: string;
}
