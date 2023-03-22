import { Injectable } from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';
import { BaseTransaction } from './base-transaction';
import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import { HelperService } from 'src/services/helper/helper.service';
import { User } from 'src/modules/user/entities/user.entity';

export interface CreditRequest {
  user: User;
  amount: number;
}

@Injectable()
export class CreditTransaction extends BaseTransaction<CreditRequest, number> {
  constructor(connection: Connection, _helper: HelperService) {
    super(connection, _helper);
  }

  protected async execute(
    request: CreditRequest,
    manager: EntityManager,
  ): Promise<number> {
    const wallet = await manager.findOne(
      Wallet,
      { userId: request.user.id },
      { lock: { mode: 'pessimistic_write' } },
    );
    const balance = Number(
      (Number(wallet.balance) + Number(request.amount)).toFixed(3),
    );
    await manager.update(Wallet, wallet.id, {
      balance: balance,
    });
    return request.amount;
  }
}
