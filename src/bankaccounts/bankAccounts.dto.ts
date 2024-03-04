import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class bankAccountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  balance: number;
}

export class updateBankAccountDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsNumber()
  balance: number;
}
