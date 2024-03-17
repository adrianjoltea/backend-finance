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

export const StockSchema = SchemaFactory.createForClass(Stock);
