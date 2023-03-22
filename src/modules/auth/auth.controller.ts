import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { RoleService } from '../role/role.service';

@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private _user: UserService,
    private _auth: AuthService,
    private _role: RoleService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @ApiBody({ type: loginDto })
  @Post('login')
  async login(@Request() req) {
    const data = await this._auth.loginUser(req.user, req.headers);
    return {
      status: true,
      message: 'User successfully logged in',
      data: data,
    };
  }

  @ApiCreatedResponse({ type: User })
  @HttpCode(201)
  @Post('sign-up')
  async create(@Body() createUserDto: CreateUserDto) {
    const role = await this._role.findOne('user');
    await this._user.register(createUserDto, role);
    return {
      status: true,
      message: 'User successfully created',
    };
  }
}
