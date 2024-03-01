import {
  Body,
  Controller,
  Post,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { AuthPayloadDto } from './dto/auto.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Body() authPayload: AuthPayloadDto) {
    const user = await this.authService.validateUser(authPayload);
    if (!user) throw new HttpException('Invalid credentials', 401);
    return user;
  }
}
