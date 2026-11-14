import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { PaisService } from '../services/pais.service';
import { CreatePaisDto } from '../dtos/pais.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { AdminWrite } from '../../../common/decorators/admin-write.decorator';

@ApiTags('Pais')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@AdminWrite()
@Controller('pais')
export class PaisController {
    constructor(private readonly paisService: PaisService) { }

    @Post('/')
    async createPais(@Body() payload: CreatePaisDto, @Req() req) {
        const userId = req.user?.id;

        if (!userId) {
            return {
                message: "Usuario no autenticado",
                statusCode: 401
            };
        }

        payload.user_create_id = userId;

        const newPais = await this.paisService.createPais(payload);
        const data = {
            data: newPais,
            message: 'Pais agregado correctamente',
        };
        return data;
    }

    @Get('/')
    async findAll() {
        const pais = await this.paisService.findAll();
        const data = {
            data: pais,
            message: 'ok',
        };
        return data;
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const pais = await this.paisService.findOne(id);
        const data = {
            data: pais,
            message: 'ok',
        };
        return data;
    }

    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: CreatePaisDto,
        @Req() req
    ) {
        const userId = req.user?.id;

        if (!userId) {
            return {
                message: "Usuario no autenticado",
                statusCode: 401
            };
        }

        payload.user_update_id = userId;

        const pais = await this.paisService.update(id, payload);
        return {
            data: pais,
            message: 'Pais actualizado correctamente',
        }
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
        const userId = req.user?.id;
        if (!userId) {
            return {
                message: "Usuario no autenticado",
                statusCode: 401
            };

        }
        const pais = await this.paisService.delete(id, userId);

        return {
            data: pais,
            message: 'Pais eliminado correctamente',
        };
    }
}
