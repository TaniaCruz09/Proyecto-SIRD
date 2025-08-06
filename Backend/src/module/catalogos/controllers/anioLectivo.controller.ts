import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Utilities } from '../../../common/helpers/utilities';
import { CreateAnioLectivoDTO } from '../dtos/anioLectivo.dto';
import { AnioLectivoService } from '../services/anioLectivo.service';

@ApiTags('anioLectvio')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('anioLectivo')
export class AnioLectivoController {
    constructor(
        private readonly anioLectivoService: AnioLectivoService,
    ) { }

    @Post('/')
    async createAnioLectivo(
        @Body() createAnioLectivoDTO: CreateAnioLectivoDTO,
        @Req() req,
    ) {
        try {
            const userId = req.user?.id; // Obtener el ID del usuario autenticado

            if (!userId) {
                return {
                    message: 'Usuario no autenticado',
                    statusCode: 401,
                };
            }

            // Agregar el user_update_id al payload
            createAnioLectivoDTO.user_create_id = userId;

            const anioLectivo = await this.anioLectivoService.createAnioLectivo(
                createAnioLectivoDTO,
            );
            const data = {
                data: anioLectivo,
                message: 'año lectivo Agregado Correctamente',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    @Get('/')
    async getAnioLectivo() {
        try {
            const anioLectivo = await this.anioLectivoService.getAnioLectivo();
            const data = {
                data: anioLectivo,
                message: 'Ok',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    @Get('/:id')
    async getAnioLectivoById(@Param('id', ParseIntPipe) id: number) {
        try {
            const anioLectivo = await this.anioLectivoService.getAnioLectivoById(
                id
            );
            const data = {
                data: anioLectivo,
                message: 'ok',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    @Put('/:id')
    async editarAnioLectivo(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: CreateAnioLectivoDTO,
        @Req() req, // Capturar el usuario autenticado
    ) {
        try {
            const userId = req.user?.id; // Obtener el ID del usuario autenticado

            if (!userId) {
                return {
                    message: 'Usuario no autenticado',
                    statusCode: 401,
                };
            }

            // Agregar el user_update_id al payload
            payload.user_update_id = userId;

            const anioLectivo = await this.anioLectivoService.editAnioLectivo(
                id,
                payload,
            );
            const data = {
                data: anioLectivo,
                message: 'Año lectivo actualizado correctamente',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    @Delete('/:id')
    async deleteAnioLectivo(@Param('id', ParseIntPipe) id: number, @Req() req) {
        try {
            const userId = req.user?.id; // Obtener el ID del usuario autenticado

            if (!userId) {
                return {
                    message: 'Usuario no autenticado',
                    statusCode: 401,
                };
            }
            const anioLectivo = await this.anioLectivoService.deleteAnioLectivo(
                id,
                userId,
            );
            const data = {
                data: anioLectivo,
                message: 'Año lectivo eliminado correctamente',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error);
        }
    }
}
