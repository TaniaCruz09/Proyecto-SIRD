import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { GenderService } from "../services/gender.service";
import { GenderDto } from "../dtos/gender.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/module/auth/guards/jwt.guard";
import { AdminWrite } from '../../../common/decorators/admin-write.decorator';

@ApiTags('Gender')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@AdminWrite()
@Controller('gender')

export class GenderController {
    constructor(private readonly genderService: GenderService) { }

    @Post('/')
    async createGrades(@Body() payload: GenderDto, @Req() req) {
        const userId = req.user?.id; // Obtener el ID del usuario autenticado

        if (!userId) {
            return {
                message: "Usuario no autenticado",
                statusCode: 401
            };
        }

        // Agregar el user_update_id al payload
        payload.user_create_id = userId;

        const newGender = await this.genderService.created(payload);
        const data = {
            data: newGender,
            message: 'created',
        }
        return data;
    }

    @Get('/')
    async getGender() {
        const gender = await this.genderService.getGender();
        const data = {
            data: gender,
            message: 'ok',
        };
        return data;
    }

    @Get('/:id')
    async getGenderById(@Param('id', ParseIntPipe) id: number) {
        const gender = await this.genderService.getGenderById(id);
        const data = {
            data: gender,
            message: 'all ok',
        };
        return data;
    }

    @Put('/:id')
    async updateGender(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: GenderDto,
        @Req() req

    ) {

        const userId = req.user?.id; // Obtener el ID del usuario autenticado

        if (!userId) {
            return {
                message: "Usuario no autenticado",
                statusCode: 401
            };
        }

        // Agregar el user_update_id al payload
        payload.user_update_id = userId;
        const gender = await this.genderService.updateGender(id, payload);
        const data = {
            data: gender,
        }
        return data;
    }

    @Delete('/:id')
    async deleteGender(
        @Param('id', ParseIntPipe) id: number,
        @Req() req
    
    ) {
          const userId = req.user?.id; // Obtener el ID del usuario autenticado

        if (!userId) {
          return {
            message: "Usuario no autenticado",
            statusCode: 401
          };
        }

              const gender = await this.genderService.deleteGender(id,userId);
              return {
                  data: gender,
                  message: 'Profession marked as deleted',
                };
    }
}