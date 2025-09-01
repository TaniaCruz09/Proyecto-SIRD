import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Utilities } from 'src/common/helpers/utilities';
import { GrupoAsignaturaConEstudiantesService } from '../services/grupo-asignatura-con-estudiantes.service';
import { AsignarEstudianteAGrupoDto } from '../dtos/grupos-asignatura-con-estudiantes.dto';

@ApiTags('grupo-asignatura-estudiantes')
@ApiBearerAuth()
@Controller('grupo-asignatura-estudiantes')
export class GrupoAsignaturaConEstudiantesController {
    constructor(private readonly grupoAsignaturaConEstudiantesService: GrupoAsignaturaConEstudiantesService) { }

    @Post('asignar')
    async asignar(@Body() dto: AsignarEstudianteAGrupoDto) {
        console.log(dto)
        try {
            const grupo_con_estudiante = await this.grupoAsignaturaConEstudiantesService.saveEstudianteAGrupo(dto);
            const data = {
                data: grupo_con_estudiante,
                message: 'agregado correctamente ',
            };

            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Post('mover-estudiante')
    async moverEstudiante(
        @Body() body: { estudianteId: number; grupoOrigenId: number; grupoDestinoId: number }
    ) {
        try {
            const grupoConEstudiantes = await this.grupoAsignaturaConEstudiantesService.moverEstudianteDeGrupo(
                body.estudianteId,
                body.grupoOrigenId,
                body.grupoDestinoId,);
            const data = {
                data: grupoConEstudiantes,
                message: 'ok',
            };

            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Get()
    async getGrupoAsignaturaConEstudiantes() {
        try {
            const grupoConEstudiantes = await this.grupoAsignaturaConEstudiantesService.getAllGruposAsignaturasConEstudiantes();
            const data = {
                data: grupoConEstudiantes,
                message: 'ok',
            };

            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Get("obtenerEstudiantes-por-grupo/:grupoId")
    async getPorGrupo(@Param("grupoId", ParseIntPipe) grupoId: number) {
        try {
            const grupoConEstudiantes = await this.grupoAsignaturaConEstudiantesService.obtenerEstudiantesAsignados(grupoId);
            const data = {
                data: grupoConEstudiantes,
                message: 'ok',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Delete('/grupo/:grupoId/estudiante/:estudianteId')
    async delete(
        @Param('estudianteId') estudianteId: number,
        @Param('grupoId') grupoId: number,
    ) {
        try {
            const result = await this.grupoAsignaturaConEstudiantesService.eliminarEstudianteDeGrupoAsignatura(estudianteId,
                grupoId,);
            const data = {
                data: result,
                message: 'ok',
            };

            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }


}