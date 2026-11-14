import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { AdminWrite } from '../../../common/decorators/admin-write.decorator';
import { EsquelaResumenService } from './esquela-resumen.service';
import { PromediosService } from '../promedios/promedios.service';

@ApiTags('esquelas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('esquelas')
export class EsquelasController {
  constructor(
    private readonly resumenService: EsquelaResumenService,
    private readonly promediosService: PromediosService,
  ) {}

  @Get(':id/resumen')
  async resumen(@Param('id', ParseIntPipe) id: number) {
    const data = await this.resumenService.build(id);

    return {
      data,
      message: 'ok',
    };
  }

  @Post(':id/recalcular')
  @AdminWrite()
  async recalcular(@Param('id', ParseIntPipe) id: number) {
    const actualizados = await this.promediosService.recalcularEsquela(id);

    return {
      data: { actualizados },
      message: 'Promedios recalculados correctamente',
    };
  }
}
