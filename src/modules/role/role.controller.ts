import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth('JWT-auth')
@ApiTags('Role')
@Controller(['role'])
export class RoleController {
  constructor(private _role: RoleService) {}

  @ApiCreatedResponse({ status: 201, type: Role })
  @HttpCode(201)
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const result = await this._role.create(createRoleDto);
    return {
      status: true,
      message: 'Role successfully created',
      data: result,
    };
  }

  @ApiOkResponse({ status: 200, type: Role, isArray: true })
  @HttpCode(200)
  @Get()
  async find() {
    const result = await this._role.find();
    return {
      status: true,
      message: 'Roles successfully retrieved',
      data: result,
    };
  }

  @ApiOkResponse({ status: 200, type: Role })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'ID of role' })
  @Patch(':id')
  async update(@Param('id') id, @Body() createRoleDto: CreateRoleDto) {
    await this._role.update(id, createRoleDto.name);
    return {
      status: true,
      message: 'Role successfully updated',
    };
  }

  @ApiOkResponse({ status: 200 })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'ID of role' })
  @Delete(':id')
  async delete(@Param('id') id) {
    await this._role.delete(id);
    return {
      status: true,
      message: 'Role successfully deleted',
    };
  }
}
