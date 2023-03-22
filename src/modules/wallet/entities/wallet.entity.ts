import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  @Exclude()
  @ApiProperty()
  id?: number;

  @ApiProperty()
  @Exclude()
  @Column({ length: 199 })
  hash: string;

  @ApiProperty()
  @Column({ length: 199 })
  type: string;

  @ApiProperty()
  @Column({
    type: 'double',
    scale: 8,
    precision: 20,
    nullable: true,
    default: 0,
  })
  balance: number;

  @ApiProperty()
  @Column()
  @Exclude()
  userId?: number;

  @ManyToOne(() => User, (user) => user.wallets)
  user?: User;

  @Column({ default: true })
  currency: string;

  @ApiProperty()
  @Column({ default: true })
  @Exclude()
  status?: boolean;

  @CreateDateColumn()
  @ApiProperty()
  @Exclude()
  created_at?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  @Exclude()
  updated_at?: Date;
}
