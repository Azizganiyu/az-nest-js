import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RealIP } from 'nestjs-real-ip';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { WithdrawalDto } from './dto/withdraw.dto';
import { WithdrawalService } from './withdrawal.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles('user')
@ApiBearerAuth('JWT-auth')
@ApiTags('Withdrawal')
@Roles('user')
@Controller('transaction/withdraw')
export class WithdrawalController {
  constructor(private _withdrawal: WithdrawalService) {}

  @ApiOkResponse({ status: 200 })
  @HttpCode(200)
  @Post()
  async withdrawal(
    @RealIP() ip: string,
    @Request() req,
    @Body() request: WithdrawalDto,
  ) {
    const transaction: any = await this._withdrawal.withdraw(request, req.user);
    delete transaction.provider_reference;
    delete transaction.from_usId;
    delete transaction.to_usId;
    delete transaction.fee_value;
    delete transaction.fee_type;
    transaction.from_us = transaction.from_us?.business_name;
    transaction.to_us = transaction.to_us?.business_name;
    return {
      status: true,
      message: 'Withdrawal completed successfully',
      data: transaction,
    };
  }
}
