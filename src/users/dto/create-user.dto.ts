// src/users/dto/create-user.dto.ts
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10,11}$/, {
    message: 'Phone must have 10 or 11 digits',
  })
  phone!: string;
}
