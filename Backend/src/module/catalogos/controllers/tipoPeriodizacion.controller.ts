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
import { TipoPeriodizacionService } from '../services/tipoPeriodizacion.service';
import { CreateTipoPeriodizacionDto } from '../dtos/tipoPeriodizacion.dto';
import { AdminWrite } from '../../../common/decorators/admin-write.decorator';

@ApiTags('Tipos Periodizacion')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@AdminWrite()
@Controller('tipo-periodizacion')
export class TipoPeriodizacionController {
  constructor(private readonly tipoPeriodizacionService: TipoPeriodizacionService) {}

  @Post('/')
  async create(@Body() payload: CreateTipoPeriodizacionDto, @Req() req) {
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
  }

  @Get('/')
  async findAll() {
    const data = await this.tipoPeriodizacionService.findAll();
    return {
      data,
      message: 'Tipos de periodizacion encontrados',
    };
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.tipoPeriodizacionService.findOne(id);
    return {
      data,
      message: 'Tipo de periodizacion encontrado',
    };
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: CreateTipoPeriodizacionDto,
    @Req() req,
  ) {
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
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user?.id;
    if (!userId) {
      return { message: 'Usuario no autenticado', statusCode: 401 };
    }

    const deleted = await this.tipoPeriodizacionService.delete(id, userId);
    return {
      data: deleted,
      message: 'Tipo de periodizacion eliminado correctamente',
    };
  }
}
