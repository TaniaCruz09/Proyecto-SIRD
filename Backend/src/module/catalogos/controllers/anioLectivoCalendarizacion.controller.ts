import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { AnioLectivoCalendarizacionService } from '../services/anioLectivoCalendarizacion.service';
import { UpsertAnioLectivoCalendarizacionDto } from '../dtos/anioLectivoCalendarizacion.dto';
import { AdminWrite } from '../../../common/decorators/admin-write.decorator';

@ApiTags('Anio Lectivo Calendarizacion')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@AdminWrite()
@Controller('anio-lectivo-calendarizacion')
export class AnioLectivoCalendarizacionController {
  constructor(
    private readonly anioLectivoCalendarizacionService: AnioLectivoCalendarizacionService,
  ) {}

  @Get('/anio-lectivo/:anioLectivoId/modalidad/:modalidadId')
  async getByAnioLectivoAndModalidad(
    @Param('anioLectivoId', ParseIntPipe) anioLectivoId: number,
    @Param('modalidadId', ParseIntPipe) modalidadId: number,
  ) {
    const data = await this.anioLectivoCalendarizacionService.getByAnioLectivoAndModalidad(
      anioLectivoId,
      modalidadId,
    );
    return {
      data,
      message: 'Calendarizacion encontrada',
    };
  }

  @Put('/anio-lectivo/:anioLectivoId/modalidad/:modalidadId')
  async upsertByAnioLectivoAndModalidad(
    @Param('anioLectivoId', ParseIntPipe) anioLectivoId: number,
    @Param('modalidadId', ParseIntPipe) modalidadId: number,
    @Body() payload: UpsertAnioLectivoCalendarizacionDto,
    @Req() req,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return { message: 'Usuario no autenticado', statusCode: 401 };
    }

    const data = await this.anioLectivoCalendarizacionService.upsertByAnioLectivoAndModalidad(
      anioLectivoId,
      modalidadId,
      payload,
      userId,
    );

    return {
      data,
      message: 'Calendarizacion actualizada correctamente',
    };
  }
}