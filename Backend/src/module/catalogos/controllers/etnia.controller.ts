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
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EtniaService } from '../services/etnia.service';
import { CreateEtniaDto } from '../dtos/etnia.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/module/auth/guards/jwt.guard';
import { AdminWrite } from '../../../common/decorators/admin-write.decorator';

@ApiTags('Etnia')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@AdminWrite()
@Controller('etnia')
export class EtniaController {
  constructor(private readonly etniaService: EtniaService) { }

  @Post('/')
  async create(@Body() payload: CreateEtniaDto, @Req() req) {
    const userId = req.user?.id; // Obtener el ID del usuario autenticado

    if (!userId) {
      return {
        message: 'Usuario no autenticado',
        statusCode: 401,
      };
    }

    // Agregar el user_update_id al payload
    payload.user_create_id = userId;

    const etnia = await this.etniaService.create(payload);
    const data = {
      data: etnia,
      message: 'ok',
    };
    return data;
  }

  @Get('/')
  async findAll() {
    const etnia = await this.etniaService.findAll();
    const data = {
      data: etnia,
      message: 'ok',
    };
    return data;
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const etnia = await this.etniaService.findOne(id);
    const data = {
      data: etnia,
      message: 'ok',
    };
    return data;
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: CreateEtniaDto,
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
    const etnia = await this.etniaService.update(id, payload);
    const data = {
      data: etnia,
      message: 'Etnia actualizada correctamente',
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
    const etnia = await this.etniaService.delete(id, userId);
    const data = {
      data: etnia,
      message: 'Etnia eliminada correctamente',
    };
    return data;
  }
}
