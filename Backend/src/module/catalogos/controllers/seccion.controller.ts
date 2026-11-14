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
import { CreateSeccionDTO } from '../dtos/seccion.dto';
import { SeccionService } from '../services/seccion.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { AdminWrite } from '../../../common/decorators/admin-write.decorator';

@ApiTags('Seccion')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@AdminWrite()
@Controller('seccion')
export class SeccionController {
  constructor(private readonly seccionService: SeccionService) {}

  @Get('/')
  async findAll() {
    const seccion = await this.seccionService.findAll();
    const data = {
      data: seccion,
      message: 'ok',
    };
    return data;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const seccion = await this.seccionService.findOne(id);
    const data = {
      data: seccion,
      message: 'ok',
    };
    return data;
  }

  @Post('/')
  async create(@Body() payload: CreateSeccionDTO, @Req() req) {
    const userId = req.user?.id; // Obtener el ID del usuario autenticado

    if (!userId) {
      return {
        message: 'Usuario no autenticado',
        statusCode: 401,
      };
    }

    // Agregar el user_update_id al payload
    payload.user_create_id = userId;

    const seccion = await this.seccionService.create(payload);
    const data = {
      data: seccion,
      message: 'ok',
    };
    return data;
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: CreateSeccionDTO,
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

    const seccion = await this.seccionService.update(id, payload);
    const data = {
      data: seccion,
      message: 'Seccion actualizada correcto',
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

    const seccion = await this.seccionService.delete(id, userId);
    const data = {
      data: seccion,
      message: 'Seccion eliminada correctamente',
    };
    return data;
  }
}
