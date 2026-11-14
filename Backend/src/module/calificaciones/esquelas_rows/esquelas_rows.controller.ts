import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EsquelaRowService } from './esquelas_rows.service';
import { CreateEsquelaRowDto } from './esquelas_rows.dto';
import { UpdateCalificacioneDto } from './update_esquelas_rows.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('esquela_row')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('esquela_row')
export class EsquelaRowController {
    constructor(private readonly EsquelaRowService: EsquelaRowService) { }

    @Post()
    async createEsquelaRow(@Body() payload: CreateEsquelaRowDto) {
        const nuevaCalificacion = await this.EsquelaRowService.create(payload)
        const data = {
            data: nuevaCalificacion,
            message: 'Calificación creada correctamente',
        }
        return data;
    }

    @Get()
    async findAllEsquelaRow() {
        const calificaciones = await this.EsquelaRowService.findAll();
        const data = {
            data: calificaciones,
            message: 'ok'
        }
        return data;
    }

    @Get(':id')
    async findOneEsquelaRowById(@Param('id', ParseIntPipe) id: number) {
        const calificaciones = await this.EsquelaRowService.findOne(id);
        const data = {
            data: calificaciones,
            message: 'ok'
        }
        return data;
    }

    @Get('estudiante/:estudianteId/anio/:anioLectivo')
    async findByEstudianteAndYear(
        @Param('estudianteId', ParseIntPipe) estudianteId: number,
        @Param('anioLectivo', ParseIntPipe) anioLectivo: number
    ) {
        const calificaciones = await this.EsquelaRowService.findCalificacionesByEstudianteAndAnio(
            estudianteId,
            anioLectivo
        );

        return {
            data: calificaciones,
            message: 'Calificaciones encontradas correctamente',
        };
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() payload: UpdateCalificacioneDto) {
        const calificiones = await this.EsquelaRowService.update(id, payload);
        const data = {
            data: calificiones,
            message: 'Calificación actualizada correctamente'
        }
        return data;
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        const calificaciones = await this.EsquelaRowService.remove(id)
        const data = {
            data: calificaciones,
            message: "Calificación eliminada correctamente"
        }
        return data;
    }
}
