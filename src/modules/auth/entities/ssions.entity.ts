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
export class Ssions {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id?: number;

  @Exclude()
  @ApiProperty()
  @Column({ type: 'text' })
  token: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  client_type: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  client_name: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  client_version: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  os_name: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  os_version: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  device_type: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  device_brand: string;

  @ApiProperty()
  @Column()
  expires_at: Date;

  @Exclude()
  @ApiProperty()
  @Column()
  userId?: number;

  @Exclude()
  @ManyToOne(() => User, (user) => user.sessions)
  user?: User;

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
