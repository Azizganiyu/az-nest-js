import { BadRequestException, Injectable } from '@nestjs/common';
import { HelperService } from 'src/services/helper/helper.service';
import { Transaction } from '../transaction/entities/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';
import { User } from '../user/entities/user.entity';
import { WalletService } from '../wallet/wallet.service';
import { DepositDto } from './dto/deposit.dto';

@Injectable()
export class DepositService {
  constructor(
    private _wallet: WalletService,
    private _helper: HelperService,
    private _transaction: TransactionService,
  ) {}

  async deposit(request: DepositDto, user: User) {
    const reference = await this._transaction.findRef(
      request.reference,
      user.id,
    );
    if (!reference) {
      throw new BadRequestException('invalid reference');
    }
    if (reference.status) {
      throw new BadRequestException('Reference has already been used');
    }
    if (this._helper.checkExpired(reference.expire_at)) {
      throw new BadRequestException('Reference has expired');
    }

    const wallet = await this._wallet.getUserWallet(user);
    if (!wallet) {
      throw new BadRequestException('This user has not been assigned a wallet');
    }
    await this._wallet.credit(request.amount, user);

    const trx: Transaction = {
      userId: user.id,
      user: user,
      amount: Number(Number(request.amount).toFixed(3)),
      currency: 'NGN',
      reference: request.reference,
      type: 'DEPOSIT',
      status: 'success',
      provider_reference: request.reference,
      settled_at: new Date(),
    };
    const transaction = await this._transaction.create(trx);
    await this._transaction.updateRef(reference.id);
    return transaction;
  }
}
