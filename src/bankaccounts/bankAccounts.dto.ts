import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class bankAccountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  balance: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  firstColor: string;
  secondColor: string;
}

export class updateBankAccountDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsNumber()
  balance: number;
}
