import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Utilities } from 'src/common/helpers/utilities';
import { CreateGruposConEstudiantesDto } from '../dtos/grupos-con-estudiantes.dto';
import { GruposConEstudiantesService } from '../services/grupos-con-estudiantes.service';

@ApiTags('gruposConEstudiantes')
@ApiBearerAuth()
@Controller('gruposConEstudiantes')
export class GruposConEstudiantesController {
    constructor(private readonly gruposConEstudiantesService: GruposConEstudiantesService) { }

    @Post('asignar')
    async asignar(@Body() dto: CreateGruposConEstudiantesDto) {
        try {
            const grupo_con_estudiante = await this.gruposConEstudiantesService.asignarEstudianteAGrupo(dto);
            const data = {
                data: grupo_con_estudiante,
                message: 'agregado correctamente ',
            };

            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Get()
    async getGruposConEstudiantes() {
        try {
            const grupoConEstudiantes = await this.gruposConEstudiantesService.getGruposConEstudiantes();
            const data = {
                data: grupoConEstudiantes,
                message: 'ok',
            };

            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Get("obtenerEstudiantes")
    async obtenerEstudiantes(@Query('grupoId') id: number) {
        return await this.gruposConEstudiantesService.obtenerEstudiantesAsignados(Number(id));
    }

    @Get('por-grupo/:id')
    async getListarEstudiantesDeGrupo(@Param('id') id: number) {
        try {
            const grupoConEstudiantes = await this.gruposConEstudiantesService.ListarEstudiantesDeGrupo(id);
            const data = {
                data: grupoConEstudiantes,
                message: 'ok',
            };

            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Get('/:id')
    async getById(@Param('id', ParseIntPipe) id: number) {
        try {
            const grupoConEstudiantes = await this.gruposConEstudiantesService.findByGrupo(id);
            const data = {
                data: grupoConEstudiantes,
                message: 'ok',
            };

            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Delete('/:id')
    async delete(@Param('id') id: number) {
        try {
            const grupoConEstudiantes = await this.gruposConEstudiantesService.remove(id);
            const data = {
                data: grupoConEstudiantes,
                message: 'ok',
            };

            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Put(':id')
    async actualizarGrupo(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: CreateGruposConEstudiantesDto,
    ) {
        try {
            const nuevoGrupoConEstudiante = await this.gruposConEstudiantesService.actualizarGrupoDeUnEstudiante(id, payload)
            const data = {
                data: nuevoGrupoConEstudiante,
                message: 'ok',
            };

            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

}