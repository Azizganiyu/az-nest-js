import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(199)
  first_name: string;

  @IsOptional()
  @ApiPropertyOptional()
  @MaxLength(199)
  last_name: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(199)
  phone: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(199)
  address: string;

  @IsDefined()
  @ApiProperty()
  @IsEmail()
  @MaxLength(300)
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
