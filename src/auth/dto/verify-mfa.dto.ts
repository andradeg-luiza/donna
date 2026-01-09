import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyMfaDto {
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'luiza@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Código MFA enviado ao usuário',
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  code!: string;
}
