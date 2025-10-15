import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Put,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DocentesService } from './docentes.service';
import { DocentesDTO } from './docentes.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Utilities } from '../../common/helpers/utilities';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Docentes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('docentes')
export class DocenteController {
  constructor(private readonly registroService: DocentesService) { }

  @Post('/')
  async createDocente(@Body() createDocenteDto: DocentesDTO, @Req() req) {
    try {
      const userId = req.user?.id; // Obtener el ID del usuario autenticado

      if (!userId) {
        return {
          message: 'Usuario no autenticado',
          statusCode: 401,
        };
      }

      // Agregar el user_update_id al payload
      createDocenteDto.user_create_id = userId;

      const docente = await this.registroService.createDocente(
        createDocenteDto,
      );
      const data = {
        data: docente,
        message: 'Docente agregado correctamente ',
      };
      return data;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  @Get('/')
  async getDocente() {
    try {
      const docente = await this.registroService.getDocente();
      const data = {
        data: docente,
        message: 'Ok',
      };
      return data;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  @Get('/:id')
  async getDocenteById(@Param('id', ParseIntPipe) id: number) {
    try {
      const docente = await this.registroService.getDocenteById(id);
      const data = {
        data: docente,
        message: 'Ok',
      };
      return data;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  @Get('/getGradosByDocenteId/:id')
  async getGradosByDocenteId(@Param('id', ParseIntPipe) id: number) {
    try {
      const docente = await this.registroService.getGradosByDocenteId(id);
      const data = {
        data: docente,
        message: 'Ok',
      };
      return data;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  @Put('/:id')
  async editarDocente(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: DocentesDTO,
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

      const docente = await this.registroService.editDocente(id, payload);
      const data = {
        data: docente,
        message: 'Docente actualizado correctamente',
      };
      return data;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  @Delete('/:id')
  async deleteDocente(@Param('id', ParseIntPipe) id: number, @Req() req) {
    try {
      const userId = req.user?.id; // Obtener el ID del usuario autenticado

      if (!userId) {
        return {
          message: 'Usuario no autenticado',
          statusCode: 401,
        };
      }
      const docente = await this.registroService.deleteDocente(id, userId);
      const data = {
        data: docente,
        message: 'Docente eliminado correctamente',
      };
      return data;
    } catch (error) {
      Utilities.catchError(error);
    }
  }
}
