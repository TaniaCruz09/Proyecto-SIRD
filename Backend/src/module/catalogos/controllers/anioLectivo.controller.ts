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
import { CreateAnioLectivoDTO, PreviewAnioLectivoDTO } from '../dtos/anioLectivo.dto';
import { AnioLectivoService } from '../services/anioLectivo.service';
import { AdminWrite } from '../../../common/decorators/admin-write.decorator';

@ApiTags('anioLectivo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@AdminWrite()
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
    }

    /**
     * Preview de la distribución de cortes por período, sin guardar nada.
     * Sirve para que el frontend muestre exactamente lo que se guardaría y
     * reciba los mismos errores de validación.
     */
    @Post('/preview')
    async preview(@Body() payload: PreviewAnioLectivoDTO) {
        const plan = await this.anioLectivoService.previewPeriodos({
            tipo_periodizacion_id: payload.tipo_periodizacion_id,
            tipo_periodizacion: payload.tipo_periodizacion,
            cantidad_periodos: payload.cantidad_periodos,
            cortes: payload.cortes,
            periodos: payload.periodos,
        });

        return {
            data: plan,
            message: 'ok',
        };
    }

    @Get('/')
    async getAnioLectivo() {
        const anioLectivo = await this.anioLectivoService.getAnioLectivo();
        const data = {
            data: anioLectivo,
            message: 'Ok',
        };
        return data;
    }

    @Get('/:id')
    async getAnioLectivoById(@Param('id', ParseIntPipe) id: number) {
        const anioLectivo = await this.anioLectivoService.getAnioLectivoById(id);
        const data = {
            data: anioLectivo,
            message: 'Ok',
        };
        return data;
    }

    @Put('/:id')
    async editarAnioLectivo(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: CreateAnioLectivoDTO,
        @Req() req, // Capturar el usuario autenticado
    ) {
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
    }

    @Delete('/:id')
    async deleteAnioLectivo(@Param('id', ParseIntPipe) id: number, @Req() req) {
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
    }
}
