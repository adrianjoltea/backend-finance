import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InvestService } from './invest.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { User } from 'src/schemas/User.schema';
import { investDto } from './invest.dto';

@Controller('invest')
export class InvestController {
  constructor(private investService: InvestService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createInvestition(
    @AuthUser() user: User,
    @Body() investDto: investDto,
  ) {
    const userId = user._id;
    return await this.investService.handleInvest(userId, investDto);
  }
}
