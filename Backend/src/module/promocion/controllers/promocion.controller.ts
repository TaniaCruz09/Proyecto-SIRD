import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdminWrite } from '../../../common/decorators/admin-write.decorator';
import { AplicarPromocionDto } from '../dtos/aplicar-promocion.dto';
import { ClonarEstructuraDto } from '../dtos/clonar-estructura.dto';
import { PromocionService } from '../services/promocion.service';

@ApiTags('promoción')
@ApiBearerAuth()
@Controller('promocion')
export class PromocionController {
  constructor(private readonly promocionService: PromocionService) {}

  @Get('anios-lectivos')
  @ApiOperation({ summary: 'Años lectivos con la cantidad de grupos de cada uno' })
  listarAniosLectivos() {
    return this.promocionService.listarAniosLectivos();
  }

  @Get('grupos')
  @ApiOperation({ summary: 'Grupos de un año lectivo con sus estudiantes' })
  listarGrupos(
    @Query('anioLectivoId', ParseIntPipe) anioLectivoId: number,
  ) {
    return this.promocionService.listarGrupos(anioLectivoId);
  }

  @Get('sugerencias')
  @ApiOperation({
    summary: 'Estudiantes de un grupo con el destino sugerido por sección',
  })
  obtenerSugerencias(
    @Query('grupoOrigenId', ParseIntPipe) grupoOrigenId: number,
    @Query('anioDestinoId', ParseIntPipe) anioDestinoId: number,
  ) {
    return this.promocionService.obtenerSugerencias(
      grupoOrigenId,
      anioDestinoId,
    );
  }

  @Post('clonar-estructura')
  @AdminWrite()
  @ApiOperation({
    summary: 'Crea un año lectivo nuevo copiando la estructura del anterior',
  })
  clonarEstructura(@Body() dto: ClonarEstructuraDto, @Req() req) {
    return this.promocionService.clonarEstructura(dto, req.user?.id);
  }

  @Post('aplicar')
  @AdminWrite()
  @ApiOperation({ summary: 'Inscribe a los estudiantes en sus grupos destino' })
  aplicar(@Body() dto: AplicarPromocionDto, @Req() req) {
    return this.promocionService.aplicarPromocion(dto, req.user?.id);
  }
}
