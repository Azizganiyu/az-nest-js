import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DepositService } from './deposit.service';
import { DepositDto } from './dto/deposit.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles('user')
@ApiBearerAuth('JWT-auth')
@ApiTags('Deposit')
@Controller('transaction/deposit')
export class DepositController {
  constructor(private _deposit: DepositService) {}

  @ApiOkResponse({ status: 200 })
  @Post()
  async deposit(@Request() req, @Body() request: DepositDto) {
    const transaction: any = await this._deposit.deposit(request, req.user);
    transaction.from_user = transaction.from_user?.business_name;
    transaction.to_user = transaction.to_user?.business_name;
    return {
      status: true,
      message: 'Deposit completed successfully',
      data: transaction,
    };
  }
}
