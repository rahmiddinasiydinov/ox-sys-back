import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 6)
  otp: string;
}
