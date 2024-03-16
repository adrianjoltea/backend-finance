import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { InvestService } from './invest.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { User } from 'src/schemas/User.schema';
import { createInvestitiondto, investDto } from './invest.dto';

@Controller('invest')
export class InvestController {
  constructor(private investService: InvestService) {}

  @UseGuards(JwtAuthGuard)
  @Post('invest')
  async createInvestition(
    @AuthUser() user: User,
    @Body() investDto: investDto,
  ) {
    const userId = user._id;
    return await this.investService.handleInvest(userId, investDto);
  }
  @Post('create')
  async createNewInvestition(
    @Body() createInvestitiondto: createInvestitiondto,
  ) {
    return await this.investService.createInvestition(createInvestitiondto);
  }

  @Get('get')
  async getAllInvestitions() {
    return await this.investService.getAllInvestitions();
  }
  @Delete('delete')
  async deleteInvestition(@Body() _id: string) {
    return await this.investService.deleteInvestion(_id);
  }
}
