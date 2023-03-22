import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class loginDto {
  user?: any;

  @IsDefined()
  @ApiProperty()
  email: string;

  @IsDefined()
  @ApiProperty()
  password: string;
}
