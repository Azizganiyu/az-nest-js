import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction } from '../transaction/entities/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';
import { User } from '../user/entities/user.entity';
import { WalletService } from '../wallet/wallet.service';
import { WithdrawalDto } from './dto/withdraw.dto';

@Injectable()
export class WithdrawalService {
  constructor(
    private _wallet: WalletService,
    private _transaction: TransactionService,
  ) {}

  async withdraw(request: WithdrawalDto, user: User) {
    const wallet = await this._wallet.getUserWallet(user);
    if (!wallet) {
      throw new BadRequestException('User has not been assigned a wallet');
    }
    const debit = await this._wallet.debit(user, request.amount);
    const trx: Transaction = {
      userId: user.id,
      user: user,
      amount: request.amount,
      currency: 'NGN',
      reference: debit.reference,
      type: 'WITHDRAWAL',
      status: 'pending',
    };

    const transaction = await this._transaction.create(trx);
    return transaction;
  }
}
