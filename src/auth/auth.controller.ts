import {
  Body,
  Controller,
  Get,
  HttpException,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/User.schema';
import { AuthUser } from './decorators/auth-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { updateUserDto } from './dto/updateUser.dto';
import { diskStorage } from 'multer';

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
    console.log(user);
    return await this.authService.getCurrentUser(user._id);
  }
  // @Post('update-profile')
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(FileInterceptor('profilePicture'))
  // async updateUser(
  //   @AuthUser() user: User,
  //   @Body() newUsername: string,
  //   @UploadedFile() profilePicture: Express.Multer.File,
  // ) {
  //   const userId = user._id;
  //   console.log('ciava', profilePicture);
  //   console.log('ciava2', newUsername);
  //   await this.authService.updateUser(userId, {
  //     newUsername,
  //     profilePicture,
  //   });
  // }
  @Patch('update-profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        filename: (req, file, callback) => {
          const originalName = file.originalname;
          const uniqueSuffix = Math.random();
          const filename = `${uniqueSuffix}-${originalName}`;
          callback(null, filename);
        },
        destination: 'uploads',
      }),
    }),
  )
  async updateUser(
    @AuthUser() user: User,
    @Body() { username }: updateUserDto,
    @UploadedFile() profilePicture: Express.Multer.File,
  ) {
    const userId = user._id;

    if (profilePicture && username) {
      const updatedProfile = await this.authService.updateUser(userId, {
        profilePicture,
        username,
      });
      return updatedProfile;
    } else if (profilePicture) {
      const updatedProfile = await this.authService.updateUser(userId, {
        profilePicture,
      });
      return updatedProfile;
    } else {
      const updatedUser = await this.authService.updateUser(userId, {
        username,
      });

      if (!updatedUser) throw new HttpException('User Not Found', 404);
      return updatedUser;
    }
  }
}
