import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { PageOptionsDto } from 'src/pagination/dtos';
import { PageMetaDto } from 'src/pagination/page-meta.dto';
import { PageDto } from 'src/pagination/page.dto';
import { MyRequestContext } from 'src/services/my-request-context';
import { Repository } from 'typeorm';
import { Ssions } from '../entities/ssions.entity';
import { RequestContext } from '@medibloc/nestjs-request-context';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Ssions)
    private sessionRepository: Repository<Ssions>,
  ) {}

  async validateSession() {
    const now = new Date();
    const session = await this.sessionRepository.findOne({ token: this.token });
    if (!session || session.expires_at < now || !session.status) {
      if (session && session.expires_at < now && session.status) {
        await this.sessionRepository.update(session.id, {
          status: false,
        });
      }
      throw new UnauthorizedException('Session expired');
    } else {
      now.setHours(now.getHours() + 1);
      return await this.sessionRepository.update(session.id, {
        expires_at: now,
      });
    }
  }

  async save(user: User, token, device) {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const data: Ssions = {
      token,
      client_name: device.client?.name ?? '',
      client_type: device.client?.type ?? '',
      client_version: device.client?.version ?? '',
      os_name: device.os?.name ?? '',
      os_version: device.os?.version ?? '',
      device_type: device.device?.type ?? '',
      device_brand: device.device?.brand ?? '',
      expires_at: now,
      userId: user.id,
    };
    return await this.sessionRepository.save(data);
  }

  async replaceToken(token) {
    return await this.sessionRepository.update(
      { token: this.token },
      { token },
    );
  }

  async getUserSessions(userId: number, pageOptionsDto: PageOptionsDto) {
    const now = new Date();
    const sessions = this.sessionRepository
      .createQueryBuilder('sessions')
      .where('sessions.userId = :userId', { userId })
      .andWhere('sessions.status = :status', { status: true })
      .andWhere('sessions.expires_at > :now', { now });

    const itemCount = await sessions.getCount();
    const { entities } = await sessions.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async deleteCurrentSession() {
    return await this.sessionRepository.update(
      {
        token: this.token,
      },
      { status: false },
    );
  }

  async delete(id) {
    return await this.sessionRepository.update(id, { status: false });
  }

  async updateCurrentSession() {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return await this.sessionRepository.update(
      { token: this.token },
      { expires_at: now, status: true },
    );
  }

  async update(id) {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return await this.sessionRepository.update(id, {
      expires_at: now,
      status: true,
    });
  }

  set token(token: string) {
    const ctx: MyRequestContext = RequestContext.get();
    ctx.token = token;
  }

  get token() {
    const ctx: MyRequestContext = RequestContext.get();
    return ctx.token;
  }
}
