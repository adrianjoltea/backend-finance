import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Stock {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  currentValue: number;

  @Prop({ required: true, type: [Number] })
  previousValue: number[];

  @Prop({ required: true })
  changePercent: number;
}

@Schema()
export class StockBought {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  boughtPrice: number;

  @Prop({ required: true })
  user: string;

  @Prop()
  name: string;

  @Prop()
  stockId: string;
}

export const StockSchema = SchemaFactory.createForClass(Stock);
export const StockBoughtSchema = SchemaFactory.createForClass(StockBought);
