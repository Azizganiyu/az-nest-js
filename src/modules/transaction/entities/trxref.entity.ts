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
import { Exclude } from 'class-transformer';

@Entity()
export class Trxref {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  @Exclude()
  id?: number;

  @ApiProperty()
  @Column({ nullable: true })
  @Exclude()
  userId?: number;

  @ManyToOne(() => User, (user) => user.refs)
  user?: User;

  @ApiProperty()
  @Column({ length: 199, unique: true })
  reference: string;

  @Column({ nullable: true })
  @ApiProperty()
  expire_at?: Date;

  @ApiProperty()
  @Column({ default: false })
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
