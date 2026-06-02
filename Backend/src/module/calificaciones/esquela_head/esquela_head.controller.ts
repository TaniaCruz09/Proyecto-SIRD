import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Utilities } from '../../../common/helpers/utilities';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { EsquelaHeadService } from './squela_head.service';
import { EsquelaHeadDto } from './dto/esquela_head.dto';

@ApiTags('esquela_head')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('esquela_head')
export class EsquelaHeadController {
    constructor(private readonly squelaHeadService: EsquelaHeadService) { }

    @Get('/')
    async findAll() {
        try {
            const squelaHead = await this.squelaHeadService.findAll();
            const data = {
                data: squelaHead,
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
            const esquelaHead = await this.squelaHeadService.findOne(id);
            const data = {
                data: esquelaHead,
                message: 'ok',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Get('/grupo/:grupoId')
    async findByGrupo(@Param('grupoId', ParseIntPipe) grupoId: number) {
        try {
            const esquelaHead = await this.squelaHeadService.findByGrupo(grupoId)

            if (!esquelaHead) {
                return {
                    message: 'No existe esquela para este grupo',
                    statusCode: 404,
                }
            }

            return {
                data: esquelaHead,
                message: 'ok',
            }
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Post('/')
    async create(@Body() payload: EsquelaHeadDto, @Req() req) {
        try {

            const userId = req.user?.id;

            if (!userId) {
                return {
                    message: "Usuario no encontrado",
                    statusCode: 401
                };
            }

            payload.user_create_id = userId;

            const newEsquelaHead = await this.squelaHeadService.create(payload);
            const data = {
                data: newEsquelaHead,
                message: 'esquelaHead creado correctamente',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: EsquelaHeadDto,
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

            const esquelaHead = await this.squelaHeadService.update(id, payload);
            return {
                data: esquelaHead,
                message: 'esquelaHead actualizado correctamente',
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
            const esquelaHead = await this.squelaHeadService.delete(id, userId);
            return {
                data: esquelaHead,
                message: 'esquelaHead eliminado correctamente',
            }
        } catch (error) {
            Utilities.catchError(error)
        }
    }

}
