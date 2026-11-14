import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GrupoAsignaturaConEstudiantesService } from '../services/grupo-asignatura-con-estudiantes.service';
import { ActualizarEstadoEstudianteGrupoDto, AsignarEstudianteAGrupoDto } from '../dtos/grupos-asignatura-con-estudiantes.dto';

@ApiTags('grupo-asignatura-estudiantes')
@ApiBearerAuth()
@Controller('grupo-asignatura-estudiantes')
export class GrupoAsignaturaConEstudiantesController {
    constructor(private readonly grupoAsignaturaConEstudiantesService: GrupoAsignaturaConEstudiantesService) { }

    @Post('asignar')
    async asignar(@Body() dto: AsignarEstudianteAGrupoDto) {
        const grupo_con_estudiante = await this.grupoAsignaturaConEstudiantesService.saveEstudianteAGrupo(dto);
        const data = {
            data: grupo_con_estudiante,
            message: 'agregado correctamente ',
        };

        return data;
    }

    @Post('mover-estudiante')
    async moverEstudiante(
        @Body() body: { estudianteId: number; grupoOrigenId: number; grupoDestinoId: number }
    ) {
        const grupoConEstudiantes = await this.grupoAsignaturaConEstudiantesService.moverEstudianteDeGrupo(
            body.estudianteId,
            body.grupoOrigenId,
            body.grupoDestinoId,);
        const data = {
            data: grupoConEstudiantes,
            message: 'ok',
        };

        return data;
    }

    @Get()
    async getGrupoAsignaturaConEstudiantes() {
        const grupoConEstudiantes = await this.grupoAsignaturaConEstudiantesService.getAllGruposAsignaturasConEstudiantes();
        const data = {
            data: grupoConEstudiantes,
            message: 'ok',
        };

        return data;
    }

    @Get("obtenerEstudiantes-por-grupo/:grupoId")
    async getPorGrupo(@Param("grupoId", ParseIntPipe) grupoId: number) {
        const grupoConEstudiantes = await this.grupoAsignaturaConEstudiantesService.obtenerEstudiantesAsignados(grupoId);
        const data = {
            data: grupoConEstudiantes,
            message: 'ok',
        };
        return data;
    }

    @Patch('/grupo/:grupoId/estudiante/:estudianteId/estado')
    async actualizarEstado(
        @Param('estudianteId', ParseIntPipe) estudianteId: number,
        @Param('grupoId', ParseIntPipe) grupoId: number,
        @Body() payload: ActualizarEstadoEstudianteGrupoDto,
    ) {
        const result = await this.grupoAsignaturaConEstudiantesService.actualizarEstadoEstudianteEnGrupo(
            estudianteId,
            grupoId,
            payload,
        );

        return {
            data: result,
            message: 'ok',
        };
    }

    @Delete('/grupo/:grupoId/estudiante/:estudianteId')
    async delete(
        @Param('estudianteId') estudianteId: number,
        @Param('grupoId') grupoId: number,
    ) {
        const result = await this.grupoAsignaturaConEstudiantesService.eliminarEstudianteDeGrupoAsignatura(estudianteId,
            grupoId,);
        const data = {
            data: result,
            message: 'ok',
        };

        return data;
    }

}