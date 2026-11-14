import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { UsersDto, UserPartialTypeDto } from '../dtos/users-dto';
import { UserService } from '../services';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../decorators/role.decorator';
import { UserSelfOrAdminGuard } from '../guards/user-self-or-admin.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersServices: UserService) {}

  @Get('/')
  @Role('Admin')
  async getUsers() {
    const users = await this.usersServices.getUsers();
    const data = {
      data: users,
      message: 'ok',
    };
    return data;
  }

  @Post('/')
  @Role('Admin')
  async createUser(@Body() payload: UsersDto) {
    return await this.usersServices.created(payload);
  }

  @Get('/:id')
  @UseGuards(UserSelfOrAdminGuard)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.usersServices.getUserById(id);
  }

  @Put('/:id')
  @Role('Admin')
  async updatedUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UserPartialTypeDto,
  ) {
    return await this.usersServices.updated(id, payload);
  }

  @Delete('/:id')
  @Role('Admin')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersServices.deleted(id);
  }
}
