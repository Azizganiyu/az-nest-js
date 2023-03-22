import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HelperService } from './services/helper/helper.service';

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.secret'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [HelperService],
  exports: [JwtModule, HelperService],
})
export class SharedModule {}
