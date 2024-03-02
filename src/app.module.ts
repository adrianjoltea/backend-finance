import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://jolteaadrian:PzP87OEH9bio6cjk@finance.7htqjue.mongodb.net/finance',
    ),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
