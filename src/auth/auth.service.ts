import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from 'src/schemas/Auth.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Auth.name) private authModel: Model<Auth>,
  ) {}

  async validateUser({ username, password }: AuthPayloadDto) {
    const findUser = await this.authModel.findOne({ username }).exec();
    if (!findUser) return null;

    if (password === findUser.password) {
      const { password, ...user } = findUser;
      return this.jwtService.sign(user);
    }

    return null;
  }
}
