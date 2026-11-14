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
import { CreateOrganizacionEscolarDTO } from '../../organizacionEscolar/dtos/organizacionEscolar.dto';
import { OrganizacionEscolarService } from '../services/organizacionEscolar.service';
import { OrganizacionEscolar } from '../entities/organizacionEscolar.entity';

@ApiTags('OrganizacionEscolar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizacionEscolar')
export class OrganizacionEscolarController {
  constructor(
    private readonly organizacionService: OrganizacionEscolarService,
  ) { }

  @Post('/')
  async createOrganizacion(
    @Body() createOrganizacionDTO: CreateOrganizacionEscolarDTO,
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
    createOrganizacionDTO.user_create_id = userId;

    const organizacion = await this.organizacionService.createOrganizacion(
      createOrganizacionDTO,
    );
    const data = {
      data: organizacion,
      message: 'Organizacion Agregada Correctamente',
    };
    return data;
  }

  @Get('/')
  async getOrganizacion() {
    const organizacion = await this.organizacionService.getOrganizacion();
    const data = {
      data: organizacion,
      message: 'Ok',
    };
    return data;
  }

  @Get('/:id')
  async getOrganizacionById(@Param('id', ParseIntPipe) id: number) {
    const organizacion = await this.organizacionService.getOrganizacionById(
      id,
    );
    const data = {
      data: organizacion,
      message: 'ok',
    };
    return data;
  }

  @Put('/:id')
  async editarOrganizacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: CreateOrganizacionEscolarDTO,
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

    const organizacion = await this.organizacionService.editOrganizacion(
      id,
      payload,
    );
    const data = {
      data: organizacion,
      message: 'Organizacion actualizada correctamente',
    };
    return data;
  }

  @Delete('/:id')
  async deleteOrganizacion(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user?.id; // Obtener el ID del usuario autenticado

    if (!userId) {
      return {
        message: 'Usuario no autenticado',
        statusCode: 401,
      };
    }
    const organizacion = await this.organizacionService.deleteOrganizacion(
      id,
      userId,
    );
    const data = {
      data: organizacion,
      message: 'Organizacion escolar eliminada correctamente',
    };
    return data;
  }
}
