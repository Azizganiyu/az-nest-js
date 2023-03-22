import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from 'src/pagination/dtos';
import { PageMetaDto } from 'src/pagination/page-meta.dto';
import { PageDto } from 'src/pagination/page.dto';
import { HelperService } from 'src/services/helper/helper.service';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { Trxref } from './entities/trxref.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Trxref)
    private refRepository: Repository<Trxref>,
    private helper: HelperService,
  ) {}

  async create(data: Transaction) {
    const transaction = await this.transactionRepository.create(data);
    const save = await this.transactionRepository.save(transaction);
    return save;
  }

  async findOne(id, userId = null) {
    const transaction = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.id like :id', { id: id })
      .orWhere('transaction.reference like :id', { id: id })
      .orWhere('transaction.provider_reference like :id', { id: id })
      .leftJoinAndSelect('transaction.user', 'user')
      .getOne();
    if (!transaction) {
      throw new NotFoundException('Transaction does not exist');
    }
    if (userId && transaction.userId != userId) {
      throw new ForbiddenException('You have no access to this resource');
    }
    return transaction;
  }

  async findAll(pageOptionsDto: PageOptionsDto, userId) {
    const transactions = this.transactionRepository
      .createQueryBuilder('transaction')
      .where(userId ? 'transaction.userId = :userId' : '1=1', {
        userId,
      })
      .leftJoinAndSelect('transaction.user', 'user')
      .orderBy('transaction.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await transactions.getCount();
    const { entities } = await transactions.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async generateRef(user: User) {
    const data: Trxref = {
      userId: user.id,
      expire_at: this.helper.setDateFuture(15),
      reference: user.first_name.substring(0, 3) + new Date().getTime(),
    };
    const ref = await this.refRepository.create(data);
    const save = await this.refRepository.save(ref);
    return save;
  }

  async updateRef(id) {
    return await this.refRepository.update(id, { status: true });
  }

  async findRef(reference, userId) {
    return await this.refRepository.findOne({ reference, userId });
  }
}
