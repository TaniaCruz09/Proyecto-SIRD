import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateGrupoDto } from '../../organizacionEscolar/dtos/Update-grupo.dto';
import { CreateGrupoDto } from '../../organizacionEscolar/dtos/grupos.dto';
import { JwtAuthGuard } from 'src/module/auth/guards/jwt.guard';
import { GruposService } from '../services/grupos.service';

@ApiTags('Grupos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('grupos')
export class GruposController {
    constructor(private readonly grupoService: GruposService) { }

    @Post()
    async createGrupo(@Body() createGrupoDto: CreateGrupoDto) {
        const grupos = await this.grupoService.createGrupo(createGrupoDto);
        const data = {
            data: grupos,
            message: 'Grupo agregado correctamente ',
        };

        return data;
    }

    @Get('/')
    async getgrupos() {
        const grupos = await this.grupoService.getGrupo();
        const data = {
            data: grupos,
            message: 'ok',
        };

        return data;
    }

    @Get('/:id')
    async getGruposById(@Param('id', ParseIntPipe) id: number) {
        const grupo = await this.grupoService.getGrupoById(id);
        const data = {
            data: grupo,
            message: 'ok',
        };

        return data;
    }

    @Get('/por-anio-y-grado/:anioId')
    async getGruposPorAnioYGrado(
        @Param('anioId', ParseIntPipe) anioId: number,
        @Query('gradoId', ParseIntPipe) gradoId: number) {
        const grupos = await this.grupoService.getGruposPorAnioYGrado(anioId, gradoId);
        const data = {
            data: grupos,
            message: 'ok',
        };
        return data;
    }

    @Delete('/:id')
    async deleteGrupo(@Param('id', ParseIntPipe) id: number) {
        const grupo = await this.grupoService.deleteGrupos(id);
        const data = {
            data: grupo,
            message: 'ok',
        };

        return data;
    }

    @Put('/:id')
    async updateGrupo(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateGrupoDto
    ) {
        const grupo = await this.grupoService.updateGrupos(id, payload);
        const data = {
            data: grupo,
            message: 'Grupo actualizado correctamente',
        };

        return data;
    }
}
