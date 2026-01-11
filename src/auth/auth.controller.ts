import {
  Body,
  Controller,
  Post,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyMfaDto } from './dto/verify-mfa.dto';
import { Request } from 'express';
import { ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Public()
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Public()
  @Post('mfa/verify')
  @ApiBody({ type: VerifyMfaDto })
  async verifyMfa(@Body() data: VerifyMfaDto) {
    return this.authService.verifyMfa(data);
  }

  @ApiBearerAuth('bearer')
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }
}
