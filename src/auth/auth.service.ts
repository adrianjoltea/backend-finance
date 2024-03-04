import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from 'src/schemas/Auth.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/schemas/User.schema';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Auth.name) private authModel: Model<Auth>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async registerUser({ username, password }: RegisterDto): Promise<any> {
    const existingUser = await this.authModel.findOne({ username }).exec();
    if (existingUser) {
      throw new HttpException(
        'This username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const userId = crypto.randomUUID();

    const newUser = new this.userModel({
      _id: userId,
      username,
    });
    await newUser.save();
    const createdUser = new this.authModel({ username, password, _id: userId });
    // if (username === createdUser.username)
    //   throw new HttpException('this username already exists', 401);
    return createdUser.save();
  }

  async validateUser({ username, password }: AuthPayloadDto) {
    const findUser = await this.authModel.findOne({ username }).exec();
    if (!findUser) return null;

    const isPasswordValid = await bcrypt.compare(password, findUser.password);

    if (isPasswordValid) {
      const { password, ...user } = findUser;
      const jwt = await this.jwtService.signAsync(user);

      return { accessToken: jwt };
    }

    return null;
  }

  async getCurrentUser(userId: string): Promise<User | null> {
    try {
      const user = (await this.userModel.findById(userId).exec()).populate(
        'bankAccounts',
      );
      return user;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
