import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from 'ORMConfig';
import { SeederService } from './seeder.service';

/**
 * Import and provide seeder classes.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forRoot({ ...ormConfig, autoLoadEntities: true })],
  providers: [Logger, SeederService],
})
export class SeederModule {}
