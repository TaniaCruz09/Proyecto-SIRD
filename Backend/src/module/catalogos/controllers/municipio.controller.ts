import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { MunicipioService } from '../services/municipio.service';
import { CreateMunicipioDto } from '../dtos/municipio.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Utilities } from '../../../common/helpers/utilities';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('municipio')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('municipio')
export class MunicipioController {
    constructor(private readonly municipioService: MunicipioService) { }

    @Get('/')
    async findAll() {
        try {
            const municipio = await this.municipioService.findAll();
            const data = {
                data: municipio,
                message: 'ok',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        try {
            const municipio = await this.municipioService.findOne(id);
            const data = {
                data: municipio,
                message: 'ok',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    //aqui
    @Post('/')
    async create(@Body() payload: CreateMunicipioDto, @Req() req) {
        try {

            const userId = req.user?.id;

            if (!userId) {
                return {
                    message: "Usuario no encontrado",
                    statusCode: 401
                };
            }

            payload.user_create_id = userId;

            const newMunicipio = await this.municipioService.create(payload);
            const data = {
                data: newMunicipio,
                message: 'Municipio creado correctamente',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: CreateMunicipioDto,
        @Req() req
    ) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return {
                    message: "Usuario no encontrado",
                    statusCode: 401
                };
            }

            payload.user_create_id = userId;

            const municipio = await this.municipioService.update(id, payload);
            return {
                data: municipio,
                message: 'Municipio actualizado correctamente',
            };
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    @Delete('/:id')
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @Req() req
    ) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return {
                    message: "Usuario no autenticado",
                    statusCode: 401
                };
            }
            const municipio = await this.municipioService.delete(id, userId);
            return {
                data: municipio,
                message: 'Municipio eliminado correctamente',
            }
        } catch (error) {
            Utilities.catchError(error)
        }
    }

}
