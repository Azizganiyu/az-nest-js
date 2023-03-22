import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { Ssions } from 'src/modules/auth/entities/ssions.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
import { Trxref } from 'src/modules/transaction/entities/trxref.entity';
import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id?: number;

  @ApiProperty()
  @Column({ length: 199 })
  first_name: string;

  @ApiProperty()
  @Column({ length: 199 })
  last_name: string;

  @ApiProperty()
  @Column({ unique: true, length: 199 })
  email: string;

  @ApiProperty()
  @Column({ length: 20, nullable: true })
  phone?: string;

  @ApiProperty()
  @Column({ length: 199 })
  address: string;

  @ApiProperty()
  @Column({ length: 199 })
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({ nullable: true, length: 255 })
  @Exclude()
  hash?: string;

  @ApiProperty()
  @Column({ nullable: true })
  verified_at?: Date;

  @ApiProperty()
  @Column({ nullable: true })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.users)
  role?: Role;

  @Transform(({ value }) =>
    value && value.length > 1
      ? value.sort((a, b) => b.updated_at - a.updated_at)[0]
      : {},
  )
  @OneToMany(() => Ssions, (session) => session.user)
  sessions?: Ssions[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions?: Transaction[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets?: Wallet[];

  @OneToMany(() => Trxref, (ref) => ref.user)
  refs?: Trxref[];

  @ApiProperty()
  @Column({ default: true })
  status?: boolean;

  @CreateDateColumn()
  @ApiProperty()
  created_at?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updated_at?: Date;
}
