import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { SharedModule } from 'src/shared.module';
import { DebitTransaction } from 'src/transactions/debit-transaction';
import { CreditTransaction } from 'src/transactions/credit-transaction';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), SharedModule],
  providers: [WalletService, DebitTransaction, CreditTransaction],
  exports: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
