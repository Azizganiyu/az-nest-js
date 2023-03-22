import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import authConfig from './configs/auth.config';
import { validate } from './configs/env.validation';
import ormConfig from '../ORMConfig';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SharedModule } from './shared.module';
import appConfig from './configs/app.config';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { LocalStrategy } from './modules/auth/strategies/local.strategy';
import { MulterModule } from '@nestjs/platform-express';
import { WalletModule } from './modules/wallet/wallet.module';
import { WithdrawalModule } from './modules/withdrawal/withdrawal.module';
import { DepositModule } from './modules/deposit/deposit.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RoleModule } from './modules/role/role.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 50,
    }),
    TypeOrmModule.forRoot({ ...ormConfig, autoLoadEntities: true }),
    HttpModule,
    PassportModule,
    UserModule,
    SharedModule,
    ScheduleModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [authConfig, appConfig],
      expandVariables: true,
      validate,
    }),
    AuthModule,
    WalletModule,
    HttpModule,
    WithdrawalModule,
    DepositModule,
    TransactionModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    LocalStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
