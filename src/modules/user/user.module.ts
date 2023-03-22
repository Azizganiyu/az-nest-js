import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SharedModule } from 'src/shared.module';
import { Wallet } from '../wallet/entities/wallet.entity';
import { CreateUserTransaction } from 'src/transactions/create-user-transaction';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet]), SharedModule],
  controllers: [UserController],
  providers: [UserService, CreateUserTransaction],
  exports: [UserService],
})
export class UserModule {}
