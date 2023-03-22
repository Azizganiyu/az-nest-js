import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryColumn()
  @ApiProperty()
  id: string;

  @ApiProperty()
  @Column({ length: 199 })
  name: string;

  @ApiProperty()
  @Column({ default: true })
  status?: boolean;

  @OneToMany(() => User, (user) => user.role)
  users?: User[];

  @CreateDateColumn()
  @ApiProperty()
  @Exclude()
  created_at?: Date;

  @UpdateDateColumn()
  @Exclude()
  @ApiProperty()
  updated_at?: Date;
}
