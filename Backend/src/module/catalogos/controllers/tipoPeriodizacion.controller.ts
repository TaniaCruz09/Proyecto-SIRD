import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Utilities } from '../../../common/helpers/utilities';
import { TipoPeriodizacionService } from '../services/tipoPeriodizacion.service';
import { CreateTipoPeriodizacionDto } from '../dtos/tipoPeriodizacion.dto';

@ApiTags('Tipos Periodizacion')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tipo-periodizacion')
export class TipoPeriodizacionController {
  constructor(private readonly tipoPeriodizacionService: TipoPeriodizacionService) {}

  @Post('/')
  async create(@Body() payload: CreateTipoPeriodizacionDto, @Req() req) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return { message: 'Usuario no autenticado', statusCode: 401 };
      }

      payload.user_create_id = userId;
      const created = await this.tipoPeriodizacionService.create(payload);

      return {
        data: created,
        message: 'Tipo de periodizacion agregado correctamente',
      };
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  @Get('/')
  async findAll() {
    try {
      const data = await this.tipoPeriodizacionService.findAll();
      return {
        data,
        message: 'Tipos de periodizacion encontrados',
      };
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.tipoPeriodizacionService.findOne(id);
      return {
        data,
        message: 'Tipo de periodizacion encontrado',
      };
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: CreateTipoPeriodizacionDto,
    @Req() req,
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return { message: 'Usuario no autenticado', statusCode: 401 };
      }

      payload.user_update_id = userId;
      const updated = await this.tipoPeriodizacionService.update(id, payload);

      return {
        data: updated,
        message: 'Tipo de periodizacion actualizado correctamente',
      };
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return { message: 'Usuario no autenticado', statusCode: 401 };
      }

      const deleted = await this.tipoPeriodizacionService.delete(id, userId);
      return {
        data: deleted,
        message: 'Tipo de periodizacion eliminado correctamente',
      };
    } catch (error) {
      Utilities.catchError(error);
    }
  }
}
