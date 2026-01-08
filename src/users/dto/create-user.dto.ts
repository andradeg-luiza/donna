import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^\d{10,13}$/, {
    message:
      'Phone must contain only digits and be between 10 and 13 characters',
  })
  phone!: string;

  @IsOptional()
  @IsString()
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name?: string;
}
