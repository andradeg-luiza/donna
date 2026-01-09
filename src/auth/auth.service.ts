import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyMfaDto } from './dto/verify-mfa.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  // -----------------------------
  // 1. REGISTRO
  // -----------------------------
  async register(data: RegisterDto) {
    const { email, password, phone, name } = data;

    const existing = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new BadRequestException('E-mail já está em uso.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        phone,
        name,
      },
    });

    return {
      message: 'Usuário registrado com sucesso.',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
      },
    };
  }

  // -----------------------------
  // 2. LOGIN (gera código MFA)
  // -----------------------------
  async login(data: LoginDto) {
    const { email, password } = data;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // Gerar código MFA (6 dígitos)
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        mfaCode: code,
        mfaExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutos
      },
    });

    // Aqui futuramente enviaremos o e-mail
    console.log('Código MFA (simulação):', code);

    return {
      message: 'Código MFA enviado para o e-mail.',
    };
  }

  // -----------------------------
  // 3. VERIFICAÇÃO DO MFA
  // -----------------------------
  async verifyMfa(data: VerifyMfaDto) {
    const { email, code } = data;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.mfaCode || !user.mfaExpiresAt) {
      throw new UnauthorizedException('Código inválido.');
    }

    const expired = user.mfaExpiresAt.getTime() < Date.now();

    if (expired) {
      throw new UnauthorizedException('Código expirado.');
    }

    if (user.mfaCode !== code) {
      throw new UnauthorizedException('Código inválido.');
    }

    // Limpar MFA após uso
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        mfaCode: null,
        mfaExpiresAt: null,
        mfaEnabled: true,
      },
    });

    // Gerar JWT
    const token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      message: 'Autenticação concluída.',
      token,
    };
  }
}
