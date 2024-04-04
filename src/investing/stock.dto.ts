import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BoughtStock {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  boughtPrice: number;

  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsString()
  @IsNotEmpty()
  cardId: string;
}

export class SellStock {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsNumber()
  @IsNotEmpty()
  sellPrice: number;

  @IsString()
  @IsNotEmpty()
  cardId: string;
}
