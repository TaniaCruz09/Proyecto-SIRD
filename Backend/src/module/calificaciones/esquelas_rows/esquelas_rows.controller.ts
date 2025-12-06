import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { EsquelaRowService } from './esquelas_rows.service';
import { CreateEsquelaRowDto } from './esquelas_rows.dto';
import { Utilities } from 'src/common/helpers/utilities';
import { UpdateCalificacioneDto } from './update_esquelas_rows.dto';

@Controller('esquela_row')
export class EsquelaRowController {
    constructor(private readonly EsquelaRowService: EsquelaRowService) { }

    @Post()
    async createEsquelaRow(@Body() payload: CreateEsquelaRowDto) {
        try {
            const nuevaCalificacion = await this.EsquelaRowService.create(payload)
            const data = {
                data: nuevaCalificacion,
                message: 'Calificación creada correctamente',
            }
            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Get()
    async findAllEsquelaRow() {
        try {
            const calificaciones = await this.EsquelaRowService.findAll();
            const data = {
                data: calificaciones,
                message: 'ok'
            }
            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Get(':id')
    async findOneEsquelaRowById(@Param('id', ParseIntPipe) id: number) {
        try {
            const calificaciones = await this.EsquelaRowService.findOne(id);
            const data = {
                data: calificaciones,
                message: 'ok'
            }
            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Get('estudiante/:estudianteId/anio/:anioLectivo')
    async findByEstudianteAndYear(
        @Param('estudianteId', ParseIntPipe) estudianteId: number,
        @Param('anioLectivo', ParseIntPipe) anioLectivo: number
    ) {
        try {
            const calificaciones = await this.EsquelaRowService.findCalificacionesByEstudianteAndAnio(
                estudianteId,
                anioLectivo
            );

            return {
                data: calificaciones,
                message: 'Calificaciones encontradas correctamente',
            };
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() payload: UpdateCalificacioneDto) {
        try {
            const calificiones = await this.EsquelaRowService.update(id, payload);
            const data = {
                data: calificiones,
                message: 'Calificación actualizada correctamente'
            }
            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        try {
            const calificaciones = await this.EsquelaRowService.remove(id)
            const data = {
                data: calificaciones,
                message: "Calificación eliminada correctamente"
            }
            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }
}
