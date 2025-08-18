import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { Utilities } from "src/common/helpers/utilities";
import { OrganizacionLaboralService } from "./organizacionLaboral.service";
import { OrganizacionLaboralDTO } from "./organizacionLaboral.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";


@ApiTags('organizacionLaboral')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizacionLaboral')
export class OrganizacionLaboralController {
    constructor(private readonly registroService: OrganizacionLaboralService) { }

    @Post('/')
    async createOrganizacionLaboral(@Body() createOrganizacionLaboralDto: OrganizacionLaboralDTO, @Req() req) {
        try {
            const userId = req.user?.id; // Obtener el ID del usuario autenticado

            if (!userId) {
                return {
                    message: 'Usuario no autenticado',
                    statusCode: 401,
                };
            }

            // Agregar el user_create_id al payload
            createOrganizacionLaboralDto.user_create_id = userId;

            const organizacionLaboral = await this.registroService.createOrganizacionLaboral(
                createOrganizacionLaboralDto,
            );
            const data = {
                data: organizacionLaboral,
                message: 'Organización laboral agregada correctamente ',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    @Get('/')
    async getOrganizacionLaboral() {
        try {
            const organizacionLaboral = await this.registroService.getOrganizacionLaboral();
            const data = {
                data: organizacionLaboral,
                message: 'Ok',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    @Get('/:id')
    async getOrganizacionLaboralById(@Param('id', ParseIntPipe) id: number) {
        try {
            const organizacionLaboral = await this.registroService.getOrganizacionLaboralById(id);
            const data = {
                data: organizacionLaboral,
                message: 'Ok',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    @Put('/:id')
    async updateOrganizacionLaboral(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateOrganizacionLaboralDto: OrganizacionLaboralDTO,
        @Req() req
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
            updateOrganizacionLaboralDto.user_update_id = userId;
            const organizacionLaboral = await this.registroService.updateOrganizacionLaboral(id, updateOrganizacionLaboralDto);
            const data = {
                data: organizacionLaboral,
                message: 'Organización laboral actualizada correctamente',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    @Delete('/:id')
    async deleteOrganizacionLaboral(@Param('id', ParseIntPipe) id: number, @Req() req) {
        try {
            const userId = req.user?.id; // Obtener el ID del usuario autenticado

            if (!userId) {
                return {
                    message: 'Usuario no autenticado',
                    statusCode: 401,
                };
            }

            const organizacionLaboral = await this.registroService.deleteOrganizacionLaboral(id, userId);
            const data = {
                data: organizacionLaboral,
                message: 'Organización laboral eliminada correctamente',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error);
        }
    }
    }