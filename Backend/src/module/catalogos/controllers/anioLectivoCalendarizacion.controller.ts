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
import { Utilities } from '../../../common/helpers/utilities';
import { AnioLectivoCalendarizacionService } from '../services/anioLectivoCalendarizacion.service';
import { UpsertAnioLectivoCalendarizacionDto } from '../dtos/anioLectivoCalendarizacion.dto';

@ApiTags('Anio Lectivo Calendarizacion')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('anio-lectivo-calendarizacion')
export class AnioLectivoCalendarizacionController {
  constructor(
    private readonly anioLectivoCalendarizacionService: AnioLectivoCalendarizacionService,
  ) {}

  @Get('/anio-lectivo/:anioLectivoId')
  async getByAnioLectivo(@Param('anioLectivoId', ParseIntPipe) anioLectivoId: number) {
    try {
      const data = await this.anioLectivoCalendarizacionService.getByAnioLectivo(anioLectivoId);
      return {
        data,
        message: 'Calendarizacion encontrada',
      };
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  @Put('/anio-lectivo/:anioLectivoId')
  async upsertByAnioLectivo(
    @Param('anioLectivoId', ParseIntPipe) anioLectivoId: number,
    @Body() payload: UpsertAnioLectivoCalendarizacionDto,
    @Req() req,
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return { message: 'Usuario no autenticado', statusCode: 401 };
      }

      const data = await this.anioLectivoCalendarizacionService.upsertByAnioLectivo(
        anioLectivoId,
        payload,
        userId,
      );

      return {
        data,
        message: 'Calendarizacion actualizada correctamente',
      };
    } catch (error) {
      Utilities.catchError(error);
    }
  }
}