import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateGrupoDto } from '../../organizacionEscolar/dtos/Update-grupo.dto';
import { CreateGrupoDto } from '../../organizacionEscolar/dtos/grupos.dto';
import { Utilities } from '../../../common/helpers/utilities';
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
        try {
            const grupos = await this.grupoService.createGrupo(createGrupoDto);
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
            const grupos = await this.grupoService.getGrupo();
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
            const grupo = await this.grupoService.getGrupoById(id);
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
    async deleteGrupo(@Param('id', ParseIntPipe) id: number) {
        try {
            const grupo = await this.grupoService.deleteGrupos(id);
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
