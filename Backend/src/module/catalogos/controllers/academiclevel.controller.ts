import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AcademicLevelService } from '../services/academiclevel.service';
import { AcademicLevelDto } from '../dtos/academiclevel.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/module/auth/guards/jwt.guard';
import { AdminWrite } from '../../../common/decorators/admin-write.decorator';

@ApiTags('academiclevel')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@AdminWrite()
@Controller('academiclevel')
export class AcademicLevelController {
  constructor(private readonly academicLevelService: AcademicLevelService) {}

  @Post('/')
  async createAcademicLevel(@Body() payload: AcademicLevelDto, @Req() req) {
    const userId = req.user?.id;
    if (!userId) {
      return {
        message: 'usuario no autenticado',
        statusCode: 401,
      };
    }

    payload.user_create_id = userId;

    const newAcademicLevel = await this.academicLevelService.created(payload);
    const data = {
      data: newAcademicLevel,
      message: 'creado correctamente',
    };
    return data;
  }

  @Get('/')
  async getAcademicLevel() {
    const academicLevel = await this.academicLevelService.getAcademicLevel();
    const data = {
      data: academicLevel,
      message: 'ok',
    };
    return data;
  }

  @Get('/:id')
  async getAcademicLevelById(@Param('id', ParseIntPipe) id: number) {
    const academicLevel =
      await this.academicLevelService.getAcademicLevelById(id);
    const data = {
      data: academicLevel,
      message: 'Nivel Academico encontrado',
    };
    return data;
  }

  @Put('/:id')
  async updateAcademicLevel(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: AcademicLevelDto,
    @Req() req, // Capturar el usuario autenticado
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return {
        message: 'Usuario no autenticado',
        statusCode: 401,
      };
    }

    // Agregar el user_update_id al payload
    payload.user_update_id = userId;

    const academicLevel = await this.academicLevelService.updateAcademicLevel(
      id,
      payload,
    );
    const data = {
      data: academicLevel,
      message: 'ok',
    };
    return data;
  }

  @Delete('/:id')
  async deleteAcademicLevel(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user?.id; // Obtener el ID del usuario autenticado

    if (!userId) {
      return {
        message: 'Usuario no autenticado',
        statusCode: 401,
      };
    }
    const academicLevel = await this.academicLevelService.deleteAcademicLevel(
      id,
      userId,
    );
    return {
      data: academicLevel,
      message: 'academic level marked as deleted',
    };
  }
}
