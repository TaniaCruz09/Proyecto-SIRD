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
import { ModalidadService } from '../services/modalidad.service';
import { CreateModalidadDto } from '../dtos/modalidad.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/module/auth/guards/jwt.guard';
import { AdminWrite } from '../../../common/decorators/admin-write.decorator';

@ApiTags('Modalidad')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@AdminWrite()
@Controller('modalidad')
export class ModalidadController {
  constructor(private readonly modalidadService: ModalidadService) { }

  @Get('/')
  async findAll() {
    const modalidad = await this.modalidadService.findAll();
    const data = {
      data: modalidad,
      message: 'ok',
    };
    return data;
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const modalidad = await this.modalidadService.findOne(id);
    const data = {
      data: modalidad,
      message: 'ok',
    };
    return data;
  }

  @Post('/')
  async create(@Body() payload: CreateModalidadDto, @Req() req) {
    const userId = req.user?.id; //obtener el ID del usuario autenticado

    if (!userId) {
      return {
        message: 'Usuario no autenticado',
        statusCode: 401,
      };
    }

    //Agregar el user_update_id al payload
    payload.user_create_id = userId;

    const modalidad = await this.modalidadService.create(payload);
    const data = {
      data: modalidad,
      message: 'creado correctamente',
    };
    return data;
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: CreateModalidadDto,
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
    const modalidad = await this.modalidadService.update(id, payload);
    const data = {
      data: modalidad,
      message: 'modalidad actualizada correctamente',
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
    const modalidad = await this.modalidadService.delete(id, userId);
    const data = {
      data: modalidad,
      message: 'Modalidad eliminada correctamente',
    };
    return data;
  }
}
