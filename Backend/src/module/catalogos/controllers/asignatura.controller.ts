import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, HttpException, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AsignaturaService } from '../services/asignatura.service';
import { CreateAsignaturaDto } from '../dtos/asignatura.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/module/auth/guards/jwt.guard';
import { AdminWrite } from '../../../common/decorators/admin-write.decorator';

@ApiTags('asignatura')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@AdminWrite()
@Controller('asignatura')
export class AsignaturaController {
    constructor(private readonly asignaturaService: AsignaturaService) { }

    @Get('/')
    async findAll() {
        const asignatura = await this.asignaturaService.findAll();
        const data = {
            data: asignatura,
            message: 'ok',
        };
        return data;
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const asignatura = await this.asignaturaService.findOne(id);
        const data = {
            data: asignatura,
            message: 'ok',
        };
        return data;
    }

    @Post('/')
    async create(@Body() payload: CreateAsignaturaDto, @Req() req) {
        const userId = req.user?.id;

        if (!userId) {
            return {
                message: 'Usuario no encontrado',
                statusCode: 401
            };
        }

        payload.user_create_id = userId;

        const newAsignatura = await this.asignaturaService.create(payload);
        const data = {
            data: newAsignatura,
            message: 'Asignatura creada correctamente',
        };
        return data;
    }

    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: CreateAsignaturaDto,
        @Req() req
    ) {
        const userId = req.user?.id;

        if (!userId) {
            return {
                message: 'Usuario no autenticado',
                statusCode: 401
            };
        }

        payload.user_update_id = userId;

        const asignatura = await this.asignaturaService.update(id, payload);
        return {
            data: asignatura,
            message: 'Asignatura actualizada correctamente',
        };
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
        const userId = req.user?.id;

        if (!userId) {
            return {
                message: 'Usuario no autenticado',
                statusCode: 401
            };
        }

        const asignatura = await this.asignaturaService.delete(id, userId);
        return {
            data: asignatura,
            message: 'Asignatura eliminada correctamente',
        };
    }
}
