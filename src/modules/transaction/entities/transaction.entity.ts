import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id?: number;

  @ApiProperty()
  @Column({ nullable: true })
  userId?: number;

  @ManyToOne(() => User, (user) => user.transactions)
  user?: User;

  @ApiProperty()
  @Column({ type: 'double', scale: 8, precision: 20, nullable: true })
  amount?: number;

  @ApiProperty()
  @Column({ nullable: true })
  currency?: string;

  @ApiProperty()
  @Column()
  type: string;

  @ApiProperty()
  @Column({ length: 199 })
  reference: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  provider_reference?: string;

  @Column({ nullable: true })
  @ApiProperty()
  settled_at?: Date;

  @ApiProperty()
  @Column({ length: 199, default: 'pending' })
  status?: string;

  @CreateDateColumn()
  @ApiProperty()
  created_at?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updated_at?: Date;
}
