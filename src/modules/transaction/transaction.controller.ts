import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PageOptionsDto } from 'src/pagination/dtos';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TransactionService } from './transaction.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private _transaction: TransactionService) {}

  @ApiOkResponse({ status: 200 })
  @ApiQuery({ name: 'userId', description: 'id of user', required: false })
  @Roles('admin')
  @Get()
  async getAllTransaction(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('userId') userId: number,
  ) {
    const data: any = await this._transaction.findAll(pageOptionsDto, userId);
    return {
      status: true,
      message: 'Transaction successfully retreived',
      data: data,
    };
  }

  @ApiOkResponse({ status: 200 })
  @Roles('user')
  @Get('generate-ref')
  async generateTransactionRef(@Request() req) {
    const ref = await this._transaction.generateRef(req.user);
    return {
      status: true,
      message: 'Transaction ref generated successfully',
      data: ref,
    };
  }

  @ApiOkResponse({ status: 200 })
  @Roles('user')
  @ApiParam({
    name: 'id',
    description: 'reference|id',
  })
  @Get(':id')
  async getSingleTransaction(@Request() req, @Param('id') transactionId: any) {
    const result: any = await this._transaction.findOne(
      transactionId,
      req.user.id,
    );
    return {
      status: true,
      message: 'Transaction successfully retreived',
      data: result,
    };
  }
}
