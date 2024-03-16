import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class investDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  chance: number;

  @IsString()
  @IsNotEmpty()
  bankAccountId: string;
}

export class createInvestitiondto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  chance: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
