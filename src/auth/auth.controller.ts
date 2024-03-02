import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/User.schema';
import { AuthUser } from './decorators/auth-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    const serializedData = {
      ...registerDto,
      password: hashedPassword,
    };
    const user = await this.authService.registerUser(serializedData);
    return user;
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: Request) {
    return req.user;
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    console.log('Inside Auth Controller status method');
    console.log(req.user);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@AuthUser() user: User) {
    return await this.authService.getCurrentUser(user._id);
  }
}
