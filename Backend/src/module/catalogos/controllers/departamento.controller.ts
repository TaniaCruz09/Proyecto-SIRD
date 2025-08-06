import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { DepartamentoService } from '../services/departamento.service';
import { CreateDepartamentoDto } from '../dtos/departamento.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Utilities } from '../../../common/helpers/utilities';
import { JwtAuthGuard } from 'src/module/auth/guards/jwt.guard';


@ApiTags('Departamento')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('departamento')
export class DepartamentoController {
    constructor(private readonly departamentoService: DepartamentoService) { }

    @Get('/')
    async findAll() {
        try {
            const departamento = await this.departamentoService.findAll();
            const data = {
                data: departamento,
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
            const departamento = await this.departamentoService.findOne(id);
            const data = {
                data: departamento,
                message: 'ok',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Post('/')
    async create(@Body() payload: CreateDepartamentoDto, @Req() req) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return {
                    message: 'No se encontró el usuario',
                    statusCode: 401
                };
            }

            payload.user_create_id = userId;

            const newDepartamento = await this.departamentoService.create(payload);
            const data = {
                data: newDepartamento,
                message: 'Departamento creado correctamente',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: CreateDepartamentoDto,
        @Req() req
    ) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return {
                    message: 'Usuario no encontrado',
                    statusCode: 401
                };
            }

            payload.user_update_id = userId;

            const departamento = await this.departamentoService.update(id, payload);
            return {
                data: departamento,
                message: 'Departamento actualizado correctamente',
            };
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return {
                    message: 'Usuario no autenticado',
                    statusCode: 401
                };
            }
            const departamento = await this.departamentoService.delete(id, userId);
            return {
                data: departamento,
                message: 'Departamento eliminado correctamente',
            };
        } catch (error) {
            Utilities.catchError(error)
        }
    }
}
