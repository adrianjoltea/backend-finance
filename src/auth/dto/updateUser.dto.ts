import { IsNotEmpty, IsString } from 'class-validator';

export class updateUserDto {
  @IsNotEmpty()
  @IsString()
  username?: string;

  profilePicture?: Express.Multer.File;
}
