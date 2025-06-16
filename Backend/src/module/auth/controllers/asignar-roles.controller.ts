import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AsignarRolesService } from '../services';
import { UserHasRolesDto } from '../dtos/user-has-roles';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Asignar Roles')
@ApiBearerAuth()
@Controller('asignar-roles')
//@Auth()
export class AsignarRolesController {
  constructor(private readonly asignarRolesRepo: AsignarRolesService) {}

  @Post('/:userId')
  //@Auth('Admin')
  async asignarRol(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() payload: UserHasRolesDto,
  ) {
    const data = await this.asignarRolesRepo.asignarRol(userId, payload);

    return data;
  }

  @Post('/remover/:userId')
  //@Auth('Admin')
  async removerRol(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() payload: UserHasRolesDto,
  ) {
    const data = await this.asignarRolesRepo.removerRol(userId, payload);
    return data;
  }


  @Get(':userId/roles')
async obtenerUsuarioConRoles(@Param('userId', ParseIntPipe) userId: number) {
  return await this.asignarRolesRepo.verUsuarioConRoles(userId);
}

}
