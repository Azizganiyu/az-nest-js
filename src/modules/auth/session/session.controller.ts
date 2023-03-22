import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/pagination/dtos';
import { Roles } from '../decorator/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { SessionService } from './session.service';

@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user')
@ApiTags('Sessions')
@Controller(['/sessions'])
export class SessionController {
  constructor(private _session: SessionService) {}

  @ApiOkResponse({ status: 200 })
  @HttpCode(200)
  @Get()
  async getSession(@Req() req, @Query() pageOptionsDto: PageOptionsDto) {
    const sessions = await this._session.getUserSessions(
      req.user.id,
      pageOptionsDto,
    );
    return {
      status: true,
      message: 'Sessions successfully retrieved',
      data: sessions,
    };
  }
}
