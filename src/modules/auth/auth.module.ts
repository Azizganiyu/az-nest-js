import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared.module';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SessionController } from './session/session.controller';
import { SessionService } from './session/session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ssions } from './entities/ssions.entity';
import { RoleService } from '../role/role.service';
import { Role } from '../role/entities/role.entity';

@Module({
  imports: [UserModule, SharedModule, TypeOrmModule.forFeature([Ssions, Role])],
  providers: [AuthService, SessionService, RoleService],
  controllers: [AuthController, SessionController],
  exports: [AuthService, SessionService],
})
export class AuthModule {}
