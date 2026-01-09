import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Luiza Lima', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: '81994563827', description: 'User phone number' })
  @IsString()
  @IsNotEmpty()
  @Length(10, 11)
  phone!: string;
}
