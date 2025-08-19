import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrganizacionConEstudiantesDto } from '../dtos/organizacionConEstudiantes.dto';
import { Utilities } from 'src/common/helpers/utilities';
import { OrganizacionConEstudiantesService } from '../services/organizacionConEstudiantes.service';

@ApiTags('organizacionConEstudiantes')
@ApiBearerAuth()
@Controller('organizacionConEstudiantes')
export class OrganizacionConEstudiantesController {
    constructor(private readonly organizacionService: OrganizacionConEstudiantesService) { }

    @Post('asignar')
    async asignar(@Body() dto: CreateOrganizacionConEstudiantesDto) {
        try {
            const organizacion_con_estudiante = await this.organizacionService.asignarEstudiantes(dto);
            const data = {
                data: organizacion_con_estudiante,
                message: 'agregado correctamente ',
            };

            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Get()
    async getorganizacionConEstudiantes() {
        try {
            const organizacion_con_estudiante = await this.organizacionService.getOrganizacionConEstudiantes();
            const data = {
                data: organizacion_con_estudiante,
                message: 'ok',
            };

            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Get("obtenerEstudiantes")
    async obtenerEstudiantes(@Query('organizacionEscolarId') id: number) {
        return await this.organizacionService.obtenerEstudiantesAsignados(Number(id));
    }

    @Get('por-grupo/:id')
    async getListarEstudiantesDeGrupo(@Param('id') id: number) {
        try {
            const organizacion_con_estudiante = await this.organizacionService.ListarEstudiantesDeGrupo(id);
            const data = {
                data: organizacion_con_estudiante,
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
            const organizacion_con_estudiante = await this.organizacionService.findByOrganizacion(id);
            const data = {
                data: organizacion_con_estudiante,
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
            const organizacion_con_estudiante = await this.organizacionService.remove(id);
            const data = {
                data: organizacion_con_estudiante,
                message: 'ok',
            };

            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }
}