import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'luiza@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
