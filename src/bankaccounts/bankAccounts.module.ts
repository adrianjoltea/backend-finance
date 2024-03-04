import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BankAccounts,
  BankAccountsSchema,
} from 'src/schemas/BankAccounts.schema';
import { BankAccountsController } from './bankAccounts.controller';
import { BankaccountsService } from './bankAccounts.service';
import { User, UserSchema } from 'src/schemas/User.schema';
import { Auth, AuthSchema } from 'src/schemas/Auth.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BankAccounts.name,
        schema: BankAccountsSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Auth.name,
        schema: AuthSchema,
      },
    ]),
  ],
  controllers: [BankAccountsController],
  providers: [BankaccountsService],
})
export class BankAccountsModule {}
