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

export class StockBought {
  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  purchasePrice: number;

  @Prop({ required: true })
  name: string;
}

export const StockSchema = SchemaFactory.createForClass(Stock);
export const StockBoughtSchema = SchemaFactory.createForClass(StockBought);
