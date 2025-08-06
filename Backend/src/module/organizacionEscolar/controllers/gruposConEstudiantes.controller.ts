import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrganizacionConEstudiantesDto } from '../dtos/organizacionConEstudiantes.dto';
import { Utilities } from 'src/common/helpers/utilities';
import { UpdateGrupoConEstudiantesDto } from '../dtos/updateOrganizacionConEstudiantes.dto';
import { OrganizacionConEstudiantesService } from '../services/organizacionConEstudiantes.service';

@ApiTags('organizacionConEstudiantes')
@ApiBearerAuth()
@Controller('organizacionConEstudiantes')
export class OrganizacionConEstudiantesController {
    constructor(private readonly organizacionService: OrganizacionConEstudiantesService) { }

    @Post()
    async createGrupo(@Body() createGrupoDto: CreateOrganizacionConEstudiantesDto) {
        try {
            const grupos = await this.organizacionService.createGrupo(createGrupoDto);
            const data = {
                data: grupos,
                message: 'Grupo agregado correctamente ',
            };

            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Get('/')
    async getgrupos() {
        try {
            const grupos = await this.organizacionService.getGrupo();
            const data = {
                data: grupos,
                message: 'ok',
            };

            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Get('/:id')
    async getGruposById(@Param('id', ParseIntPipe) id: number) {
        try {
            const grupo = await this.organizacionService.getGrupoById(id);
            const data = {
                data: grupo,
                message: 'ok',
            };

            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Delete('/:id')
    async deleteGrupo(@Param('id') id: number) {
        try {
            const grupo = await this.organizacionService.deleteGrupos(id);
            const data = {
                data: grupo,
                message: 'ok',
            };

            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Put('/:id')
    async updateGrupo(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateGrupoConEstudiantesDto
    ) {
        const grupo = await this.organizacionService.updateGrupos(id, payload);
        const data = {
            data: grupo,
            message: 'Grupo actualizado correctamente',
        };

        return data;
    }
}
