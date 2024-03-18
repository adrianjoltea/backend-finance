import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StockBought } from './Stock.schema';
import mongoose from 'mongoose';

@Schema()
export class Portofolio {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StockBought' }],
  })
  stocks: StockBought[];

  @Prop()
  user: string;
}

export const PortofolioSchema = SchemaFactory.createForClass(Portofolio);
