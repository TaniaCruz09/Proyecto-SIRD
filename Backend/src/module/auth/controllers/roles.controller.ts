import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RolesService } from '../services';

import { QueryParamsRolesDto } from '../dtos/query-params-roles.dto';
import { RoleDto } from '../dtos/roles.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../decorators/role.decorator';

@ApiTags('roles')
@ApiBearerAuth()
@Role('Admin')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('/')
  async getRoles(@Query() query: QueryParamsRolesDto) {
    const roles = await this.rolesService.getRoles(query);

    const data = {
      data: roles,
      message: 'Ok',
    };

    return data;
  }

  @Get('/:id')
  async getRolesById(@Param('id', ParseIntPipe) id: number) {
    const role = await this.rolesService.getRolesById(id);

    const data = {
      data: role,
      message: 'Ok',
    };

    return data;
  }

  @Post('/')
  async createRole(@Body() payload: RoleDto) {
    const role = await this.rolesService.createRole(payload);

    const data = {
      data: role,
    };

    return data;
  }

  @Put('/:id')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: RoleDto,
  ) {
    const role = await this.rolesService.updateRole(id, payload);

    const data = {
      data: role,
    };

    return data;
  }

  @Delete('/:id')
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    const role = await this.rolesService.deleteRole(id);

    const data = {
      data: role,
      message: 'Role deleted',
    };

    return data;
  }
}
