import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(199)
  address: string;
}
