import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, HttpException, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AsignaturaService } from '../services/asignatura.service';
import { createAsignaturaDto } from '../dtos/asignatura.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Utilities } from '../../../common/helpers/utilities';
import { JwtAuthGuard } from 'src/module/auth/guards/jwt.guard';

@ApiTags('asignatura')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('asignatura')
export class AsignaturaController {
    constructor(private readonly asignaturaService: AsignaturaService) {}

    @Get('/')
    async findAll() {
        try {
            const asignatura = await this.asignaturaService.findAll();
            const data = {
                data: asignatura,
                message: 'ok',
            };
            return data;
        } catch (error) {
            Utilities.catchError (error)
        }
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        try {
            const asignatura = await this.asignaturaService.findOne(id);
            const data = {
                data: asignatura,
                message: 'ok',
            };
            return data;
        } catch (error) {
            Utilities.catchError (error)
        }
    }

    @Post('/')
    async create(@Body() payload: createAsignaturaDto, @Req() req) {
        try {
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
        } catch (error) {
            Utilities.catchError (error)
        }
    }

    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: createAsignaturaDto,
        @Req() req
    ) {
        try {
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
        } catch (error) {
            Utilities.catchError (error)
        }
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
        try {
            const userId = req.user?.id;

            if(!userId) {
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
        } catch (error) {
            Utilities.catchError (error)
        }
    }
}
