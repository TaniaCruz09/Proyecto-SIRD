import { Controller, Get, Header, Param, ParseIntPipe, Post, Query, StreamableFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { AdminWrite } from '../../../common/decorators/admin-write.decorator';
import { EsquelaResumenService } from './esquela-resumen.service';
import { PromediosService } from '../promedios/promedios.service';
import { EsquelaPdfService } from './esquela-pdf.service';

@ApiTags('esquelas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('esquelas')
export class EsquelasController {
  constructor(
    private readonly resumenService: EsquelaResumenService,
    private readonly promediosService: PromediosService,
    private readonly pdfService: EsquelaPdfService,
  ) {}

  @Get(':id/resumen')
  async resumen(@Param('id', ParseIntPipe) id: number) {
    const data = await this.resumenService.build(id);

    return {
      data,
      message: 'ok',
    };
  }

  @Get(':id/pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'inline')
  async pdf(
    @Param('id', ParseIntPipe) id: number,
    @Query('vista') vista = 'ALL',
  ): Promise<StreamableFile> {
    const buffer = await this.pdfService.build(id, vista);
    return new StreamableFile(buffer, {
      type: 'application/pdf',
      disposition: `inline; filename="esquela-${id}.pdf"`,
    });
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
