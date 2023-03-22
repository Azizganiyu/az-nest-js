import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PageOptionsDto } from 'src/pagination/dtos';
import { PageMetaDto } from 'src/pagination/page-meta.dto';
import { PageDto } from 'src/pagination/page.dto';
import { CreateUserTransaction } from '../../transactions/create-user-transaction';
import { Role } from '../role/entities/role.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly createUserTransaction: CreateUserTransaction,
  ) {}

  async register(data: CreateUserDto, role: Role) {
    const values = {
      ...data,
      roleId: role.id,
    };
    await this.checkEmail(data.email);
    const createdUserData = await this.createUserTransaction.run(values);
    return createdUserData;
  }

  async checkEmail(email: string) {
    const userCount = await this.userRepository.count({ email: email });
    if (userCount > 0) {
      throw new BadRequestException('Email already exists');
    }
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const users = this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await users.getCount();
    const { entities } = await users.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    try {
      const user: any = await this.userRepository.findOneOrFail(id, {
        relations: ['role', 'wallets', 'transactions'],
      });
      return user;
    } catch (error) {
      throw new BadRequestException('user not found');
    }
  }

  async findUserWithEmail(email: string) {
    const user = await this.userRepository.findOne(
      { email },
      { relations: ['role'] },
    );
    if (!user) {
      return null;
    }
    return user;
  }

  async update(user: User, request: UpdateUserDto) {
    return await this.userRepository.save({
      ...user,
      address: request.address,
    });
  }
}
