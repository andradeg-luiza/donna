import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Maria Silva',
    description: 'User full name',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: '11999999999',
    description: 'User phone number (only digits)',
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 11)
  phone!: string;
}
