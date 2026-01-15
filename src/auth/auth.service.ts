import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyMfaDto } from './dto/verify-mfa.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  // -----------------------------------------------------
  // REGISTER
  // -----------------------------------------------------
  async register(data: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new BadRequestException('E-mail já está em uso.');
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashed,
        phone: data.phone,
        mfaEnabled: true,
      },
    });

    return {
      message: 'Usuário registrado com sucesso.',
      userId: user.id,
    };
  }

  // -----------------------------------------------------
  // LOGIN
  // -----------------------------------------------------
  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    if (user.mfaEnabled) {
      const code = this.generateMfaCode();

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          mfaCode: code,
          mfaExpiresAt: this.mfaExpiration(),
        },
      });

      return {
        mfaRequired: true,
        message: 'Código MFA enviado.',
      };
    }

    return this.generateTokens(user.id, user.email);
  }

  // -----------------------------------------------------
  // VERIFY MFA
  // -----------------------------------------------------
  async verifyMfa(data: VerifyMfaDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.mfaEnabled) {
      throw new UnauthorizedException('MFA inválido.');
    }

    if (!user.mfaCode || !user.mfaExpiresAt) {
      throw new UnauthorizedException('Nenhum código MFA ativo.');
    }

    const now = new Date();
    if (now > user.mfaExpiresAt) {
      throw new UnauthorizedException('Código MFA expirado.');
    }

    if (data.code !== user.mfaCode) {
      throw new UnauthorizedException('Código MFA incorreto.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { mfaCode: null, mfaExpiresAt: null },
    });

    return this.generateTokens(user.id, user.email);
  }

  // -----------------------------------------------------
  // HELPERS
  // -----------------------------------------------------
  private generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    return {
      accessToken: this.jwt.sign(payload),
    };
  }

  private generateMfaCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private mfaExpiration(): Date {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);
    return expires;
  }
}
