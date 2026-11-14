import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { CreateCentroDto } from './dto/create-centro.dto';
import { UpdateCentroDto } from './dto/update-centro.dto';
import { CentroService } from './centro.service';
import { AdminWrite } from '../../common/decorators/admin-write.decorator';

@AdminWrite()
@Controller('centro')
export class CentroController {
  constructor(private readonly centroService: CentroService) {}

  @Post()
  async create(@Body() createCentroDto: CreateCentroDto) {
    const centro = await this.centroService.createCentro (createCentroDto);
    const data = {
      data: centro,
      message: 'Centro creado correctamente'
    }
    return data;
  }

  @Get()
  async findAll() {
    const centro = await this.centroService.getCentro();
    const data = {
      data: centro,
      message: 'ok'
    }
    return data;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const centro = await this.centroService.getCentroById(id);
    const data = {
      data: centro,
      message: 'ok'
    }
    return data;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() payload: UpdateCentroDto) {
    const centro = await this.centroService.updateCentro(id, payload);
    const data = {
      data: centro,
      message: 'Centro actualizado correctamente'
    }
    return data;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const centro = await this.centroService.deleteCentro (id);
    const data = {
      data: centro,
      message: 'Centro eliminado correctamente'
    }
    return data;
  }
}
