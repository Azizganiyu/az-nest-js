import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { HelperService } from 'src/services/helper/helper.service';
import { Connection, EntityManager } from 'typeorm';
import { BaseTransaction } from './base-transaction';
import * as bcrypt from 'bcrypt';
import { Wallet } from 'src/modules/wallet/entities/wallet.entity';

interface UserData extends CreateUserDto {
  roleId: string;
}

@Injectable()
export class CreateUserTransaction extends BaseTransaction<UserData, User> {
  constructor(connection: Connection, _helper: HelperService) {
    super(connection, _helper);
  }

  protected async execute(
    data: UserData,
    manager: EntityManager,
  ): Promise<User> {
    const user: User = {
      ...data,
      password: await bcrypt.hash(data.password, 10),
      hash: this._helper.generateHash(),
      phone: data.phone,
      address: data.address,
      verified_at: new Date(),
    };
    const createdUser = await manager.save(User, user);
    const currency = {
      currency: 'NGN',
      user: createdUser,
      hash: this._helper.generateHash(),
      type: 'FIAT',
    };
    await manager.save(Wallet, currency);
    return createdUser;
  }
}
