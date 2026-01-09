import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyMfaDto } from './dto/verify-mfa.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('mfa/verify')
  @ApiBody({ type: VerifyMfaDto })
  async verifyMfa(@Body() data: VerifyMfaDto) {
    return this.authService.verifyMfa(data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }
}
