import { HttpException, Injectable } from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';
import { BaseTransaction } from './base-transaction';
import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import { HelperService } from 'src/services/helper/helper.service';
import { User } from 'src/modules/user/entities/user.entity';

export interface DebitRequest {
  user: User;
  amount: number;
}

export interface DebitResponse {
  fromBalance: number;
  reference: string;
}

@Injectable()
export class DebitTransaction extends BaseTransaction<
  DebitRequest,
  DebitResponse
> {
  constructor(connection: Connection, _helper: HelperService) {
    super(connection, _helper);
  }

  protected async execute(
    request: DebitRequest,
    manager: EntityManager,
  ): Promise<DebitResponse> {
    let qty = request.amount;
    const wallet = await manager.findOne(
      Wallet,
      { userId: request.user.id },
      { lock: { mode: 'pessimistic_write' } },
    );
    const walletBalance = wallet.balance;
    if (walletBalance < qty) {
      throw new HttpException('Insufficient Balance', 400);
    }
    const fromBalance = qty >= walletBalance ? walletBalance : qty;
    qty = qty - walletBalance;
    const balance = Number(wallet.balance) - Number(fromBalance);
    await manager.update(Wallet, wallet.id, {
      balance: Number(Number(balance).toFixed(3)),
    });
    const reference = 'wth' + this._helper.generateReference();
    return {
      fromBalance,
      reference,
    };
  }
}
