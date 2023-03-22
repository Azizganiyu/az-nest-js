import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'typeorm';
import { AdminSeed } from './seeds/admin.seed';
import { RoleSeed } from './seeds/role.seed';

@Injectable()
export class SeederService {
  private seeds = [RoleSeed, AdminSeed];

  constructor(
    private readonly logger: Logger,
    private readonly connection: Connection,
  ) {}
  async seed() {
    const queryRunner = await this.connection.createQueryRunner();
    const manager = queryRunner.manager;
    for (const item of this.seeds) {
      for (const value of item.data) {
        const seeded = await manager.find(item.table, value);
        if (seeded.length == 0) {
          const create = await manager.create(item.table, item.data);
          await manager.save(item.table, create);
          this.logger.debug(`${JSON.stringify(item.data)} seeded`);
        } else {
          this.logger.debug(`data exist`);
        }
      }
    }
  }
}
