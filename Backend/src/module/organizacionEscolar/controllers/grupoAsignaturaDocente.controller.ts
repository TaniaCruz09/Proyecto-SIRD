// src/module/organizacionEscolar/controllers/grupoAsignaturaDocente.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { GrupoAsignaturaDocenteService } from '../services/grupoAsignaturaDocente.service';
import { ApiTags } from '@nestjs/swagger';
import { CrearGrupoAsignaturaDocenteDto } from '../dtos/grupoAsignaturaDocente';
import { ActualizarGrupoAsignaturaDocenteDto } from '../dtos/grupoAsignaturaDocenteUpdate';

@ApiTags('GrupoAsignaturaDocente')
@Controller('grupo-asignatura-docente')
export class GrupoAsignaturaDocenteController {
  constructor(
    private readonly service: GrupoAsignaturaDocenteService,
  ) {}

  // Crear asignación de asignaturas con docente a un grupo
  @Post()
  async asignar(@Body() dto: CrearGrupoAsignaturaDocenteDto) {
    const result = await this.service.asignarAsignaturasAGrupo(dto);
    return {
      message: 'Asignaturas con docentes asignadas correctamente al grupo',
      data: result,
    };
  }

  // Listar todas las asignaciones
  @Get()
  async obtenerTodas() {
    const result = await this.service.obtenerTodasAsignaciones();
    return {
      message: 'Listado de todas las asignaciones',
      data: result,
    };
  }

  // Listar asignaciones de un grupo
  @Get('grupo/:grupoId')
  async obtenerPorGrupo(@Param('grupoId', ParseIntPipe) grupoId: number) {
    const result = await this.service.obtenerAsignacionesPorGrupo(grupoId);
    return {
      message: 'Listado de asignaturas con docentes del grupo',
      data: result,
    };
  }

  // Obtener una asignación por su ID
  @Get(':id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    const result = await this.service.obtenerAsignacionPorId(id);
    return {
      message: 'Detalle de la asignación',
      data: result,
    };
  }

  // Actualizar una asignación
  @Put(':grupoId')
async actualizar(
  @Param('grupoId', ParseIntPipe) grupoId: number,
  @Body() dto: ActualizarGrupoAsignaturaDocenteDto,
) {
  const result = await this.service.editarAsignacion(grupoId, dto);
  return {
    message: 'Asignaciones actualizadas correctamente',
    data: result,
  };
}


  // DELETE /grupo-asignatura-docente/grupo/:grupoId/asignatura/:asignaturaId
@Delete('grupo/:grupoId/asignatura/:asignaturaId')
async eliminarPorGrupoYAsignatura(
  @Param('grupoId', ParseIntPipe) grupoId: number,
  @Param('asignaturaId', ParseIntPipe) asignaturaId: number
) {
  await this.service.eliminarAsignacionPorGrupoYAsignatura(grupoId, asignaturaId);
  return {
    message: `Asignación de la asignatura ${asignaturaId} del grupo ${grupoId} eliminada correctamente`,
  };
}


  // Eliminar todas las asignaciones de un grupo
@Delete('grupo/:grupoId')
async eliminarPorGrupo(@Param('grupoId', ParseIntPipe) grupoId: number) {
  await this.service.eliminarAsignacionesPorGrupo(grupoId);
  return {
    message: `Todas las asignaciones del grupo ${grupoId} fueron eliminadas correctamente`,
  };
}
}
