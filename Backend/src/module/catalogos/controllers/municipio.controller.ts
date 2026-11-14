import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { MunicipioService } from '../services/municipio.service';
import { CreateMunicipioDto } from '../dtos/municipio.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { AdminWrite } from '../../../common/decorators/admin-write.decorator';

@ApiTags('municipio')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@AdminWrite()
@Controller('municipio')
export class MunicipioController {
    constructor(private readonly municipioService: MunicipioService) { }

    @Get('/')
    async findAll() {
        const municipio = await this.municipioService.findAll();
        const data = {
            data: municipio,
            message: 'ok',
        };
        return data;
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const municipio = await this.municipioService.findOne(id);
        const data = {
            data: municipio,
            message: 'ok',
        };
        return data;
    }

    //aqui
    @Post('/')
    async create(@Body() payload: CreateMunicipioDto, @Req() req) {

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
    }

    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: CreateMunicipioDto,
        @Req() req
    ) {
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
    }

    @Delete('/:id')
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @Req() req
    ) {
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
    }

}
