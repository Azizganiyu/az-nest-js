import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Patch,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { PageOptionsDto } from 'src/pagination/dtos';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private _user: UserService) {}

  @ApiOkResponse({ status: 200 })
  @HttpCode(200)
  @Roles('user')
  @Get('hello')
  async getLoggedUser(@Request() request) {
    console.log('users', request.user);
    const users = await this._user.findOne(request.user.id);
    return {
      status: true,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @ApiOkResponse({ status: 200 })
  @HttpCode(200)
  @Roles('admin')
  @Get('all')
  async getUsers(@Query() pageOptionsDto: PageOptionsDto) {
    const users = await this._user.findAll(pageOptionsDto);
    return {
      status: true,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @ApiResponse({ status: 200 })
  @HttpCode(200)
  @Roles('user')
  @Patch('update')
  async updateProfile(@Request() req, @Body() request: UpdateUserDto) {
    const user = await this._user.findOne(req.user.id);
    await this._user.update(user, request);
    return {
      status: true,
      message: 'User data successfully updated',
    };
  }
}
