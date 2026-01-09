import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ otp: string }> {
    const { email } = dto;
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: { email }, // Default role is 'manager' from schema
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiresAt },
    });

    return { otp };
  }

  async verify(dto: VerifyDto): Promise<{ token: string }> {
    const { email, otp } = dto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpiresAt: null },
    });

    return this.generateToken(user);
  }

  private async generateToken(user: User): Promise<{ token: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
