import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
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

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '81999999999',
  })
  @IsString()
  phone!: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Luiza',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
