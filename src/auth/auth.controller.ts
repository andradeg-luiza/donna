import { Body, Controller, Post, Get, Req, HttpCode } from '@nestjs/common';
import { ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyMfaDto } from './dto/verify-mfa.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiBody({ type: RegisterDto })
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Public()
  @Post('verify-mfa')
  @HttpCode(200)
  @ApiBody({ type: VerifyMfaDto })
  verifyMfa(@Body() data: VerifyMfaDto) {
    return this.authService.verifyMfa(data);
  }

  @ApiBearerAuth('bearer')
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }
}
