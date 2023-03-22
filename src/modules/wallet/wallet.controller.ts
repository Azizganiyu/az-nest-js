import { Controller, Get, HttpCode, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { WalletService } from './wallet.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user')
@ApiBearerAuth('JWT-auth')
@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private _wallet: WalletService) {}

  @ApiOkResponse({ status: 200 })
  @HttpCode(200)
  @Get('balance')
  async getBalance(@Request() req) {
    const wallet = await this._wallet.getUserWallet(req.user);
    return {
      status: true,
      message: 'user Balances retrieved successfully',
      data: wallet.balance,
    };
  }
}
