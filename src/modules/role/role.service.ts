import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperService } from 'src/services/helper/helper.service';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private _helper: HelperService,
  ) {}

  async create(role: Role) {
    const data = this.roleRepository.create(role);
    return await this.roleRepository.save(data);
  }

  async find() {
    return await this.roleRepository.find();
  }

  async findOne(id) {
    try {
      return await this.roleRepository.findOneOrFail(id);
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Unable to find role');
    }
  }

  async update(id: number, name: string) {
    return await this.roleRepository.update(id, { name: name });
  }

  async delete(id: number) {
    return await this.roleRepository.delete(id);
  }
}
