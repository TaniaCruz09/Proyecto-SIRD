import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { CortesService } from '../services/cortes.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCortesDto } from '../dtos/create-corte.dto';
import { AdminWrite } from '../../../common/decorators/admin-write.decorator';

@ApiTags('Cortes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@AdminWrite()
@Controller('cortes')
export class CortesController {
  constructor(private readonly cortesService: CortesService) { }

  @Post('/')
  async createcorte(@Body() payload: CreateCortesDto, @Req() req) {
    const userId = req.user?.id;

    if (!userId) {
      return {
        message: 'Usuario no autenticado',
        statusCode: 401,
      };
    }

    payload.user_create_id = userId;

    const newCortes = await this.cortesService.createcorte(payload);
    const data = {
      data: newCortes,
      message: 'Corte agregado correctamente',
    };
    return data;
  }

  @Get('/')
  async findAll() {
    const corte = await this.cortesService.findAll();
    const data = {
      data: corte,
      message: 'Cortes encontrados',
    };
    return data;
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const corte = await this.cortesService.findOne(id);
    const data = {
      data: corte,
      message: 'Corte encontrado',
    };
    return data;
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: CreateCortesDto,
    @Req() req,
  ) {
    const userId = req.user?.id;

    if (!userId) {
      return {
        message: 'Usuario no autenticado',
        statusCode: 401,
      };
    }

    payload.user_update_id = userId;

    const cortes = await this.cortesService.update(id, payload);
    return {
      data: cortes,
      message: 'Corte actualizado correctamente',
    };
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user?.id;
    if (!userId) {
      return {
        message: 'Usuario no autenticado',
        statusCode: 401,
      };
    }
    const corte = await this.cortesService.delete(id, userId);

    return {
      data: corte,
      message: 'Corte eliminado correctamente',
    };
  }
}
