import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import {
  DebitRequest,
  DebitResponse,
  DebitTransaction,
} from 'src/transactions/debit-transaction';
import {
  CreditRequest,
  CreditTransaction,
} from 'src/transactions/credit-transaction';
import { User } from '../user/entities/user.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    private readonly debitTransaction: DebitTransaction,
    private readonly creditTransaction: CreditTransaction,
  ) {}

  async credit(amount: number, user: User) {
    const data: CreditRequest = { user, amount };
    return await this.creditTransaction.run(data);
  }

  async debit(user: User, amount: number): Promise<DebitResponse> {
    const data: DebitRequest = {
      user,
      amount,
    };
    return await this.debitTransaction.run(data);
  }

  async getWallet(id) {
    try {
      return await this.walletRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException('wallet not found');
    }
  }

  async getUserWallet(user: User) {
    return await this.walletRepository.findOne({ userId: user.id });
  }
}
