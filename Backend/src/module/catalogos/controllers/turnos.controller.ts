import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TurnoService } from '../services/turnos.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { CreateTurnoDto } from '../dtos/turnos.dto';
import { AdminWrite } from '../../../common/decorators/admin-write.decorator';

@ApiTags('Turno')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@AdminWrite()
@Controller('turno')
export class TurnoController {
  constructor(private readonly turnoService: TurnoService) { }

  @Get('/')
  async findAll() {
    const turno = await this.turnoService.findAll();
    const data = {
      data: turno,
      message: 'ok',
    };
    return data;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const turno = await this.turnoService.findOne(id);
    const data = {
      data: turno,
      message: 'ok',
    };
    return data;
  }

  @Post('/')
  async create(@Body() payload: CreateTurnoDto, @Req() req) {
    const userId = req.user?.id; // Obtener el ID del usuario autenticado

    if (!userId) {
      return {
        message: 'Usuario no autenticado',
        statusCode: 401,
      };
    }

    // Agregar el user_update_id al payload
    payload.user_create_id = userId;

    const turno = await this.turnoService.create(payload);
    const data = {
      data: turno,
      message: 'ok',
    };
    return data;
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: CreateTurnoDto,
    @Req() req, // Capturar el usuario autenticado
  ) {
    const userId = req.user?.id; // Obtener el ID del usuario autenticado

    if (!userId) {
      return {
        message: 'Usuario no autenticado',
        statusCode: 401,
      };
    }

    // Agregar el user_update_id al payload
    payload.user_update_id = userId;

    const turno = await this.turnoService.update(id, payload);
    const data = {
      data: turno,
      message: 'Turno actualizado correctamente',
    };
    return data;
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user?.id; // Obtener el ID del usuario autenticado

    if (!userId) {
      return {
        message: 'Usuario no autenticado',
        statusCode: 401,
      };
    }
    const turno = await this.turnoService.delete(id, userId);
    const data = {
      data: turno,
      message: 'Turno eliminado correctamente',
    };
    return data;
  }
}
