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
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { DocentesService } from './docentes.service';
import { DocentesDTO } from './docentes.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  IMAGE_MAX_SIZE,
  imageFileFilter,
  imageStorage,
} from '../../common/uploads/image-upload';
import { removeUploadedFile } from '../../common/uploads/upload-cleanup';
import { UploadCleanupInterceptor } from '../../common/uploads/upload-cleanup.interceptor';
import { assertImageContent } from '../../common/uploads/upload-validation';

@ApiTags('Docentes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('docentes')
export class DocenteController {
  constructor(private readonly registroService: DocentesService) { }

  @Post('/')
  @UseInterceptors(
    FileInterceptor('foto_docente', {
      storage: imageStorage('docentes'),
      limits: { fileSize: IMAGE_MAX_SIZE },
      fileFilter: imageFileFilter,
    }),
    UploadCleanupInterceptor,
  )
  async createDocente(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any, // <--- recibe FormData como any
    @Req() req,
  ) {

    const userId = req.user?.id;
    if (!userId) {
      await removeUploadedFile(file);
      return { message: 'Usuario no autenticado', statusCode: 401 };
    }

    await assertImageContent(file);

    // Parsear arrays y objetos que vienen como JSON string
    const docenteDto: DocentesDTO = {
      ...body,
      sexo: JSON.parse(body.sexo),
      pais: JSON.parse(body.pais),
      municipio: JSON.parse(body.municipio),
      nivel_academico: JSON.parse(body.nivel_academico),
      profession: JSON.parse(body.profession),
      user_create_id: userId,
    };

    // Guardar foto si existe
    if (file) docenteDto.foto_docente = `/uploads/docentes/${file.filename}`;
    //console.log("📸 Ruta de la foto asignada al DTO:", docenteDto.foto_docente);

    const docente = await this.registroService.createDocente(docenteDto);
    ////console.log("📸 Nueva ruta de la foto asignada al DTO:", docenteDto.foto_docente);
    return { data: docente, message: 'Docente agregado correctamente' };
  }

  @Get('/')
  async getDocente() {
    const docente = await this.registroService.getDocente();
    //console.log('📦 Docentes obtenidos del backend:', docente); // 👈 aquí
    const data = {
      data: docente,
      message: 'Ok',
    };
    return data;
  }

  @Get('/existe')
  async existe(
    @Query('cedula') cedula?: string,
    @Query('excluirId') excluirId?: string,
  ) {
    const resultado = await this.registroService.existeCedula(
      cedula,
      excluirId ? Number(excluirId) : undefined,
    );

    return {
      data: {
        existe: resultado.existe,
        campo: resultado.existe ? 'cedula' : null,
        valor: resultado.existe ? (cedula ?? '').trim() : null,
      },
      message: 'ok',
    };
  }

  @Get('/:id')
  async getDocenteById(@Param('id', ParseIntPipe) id: number) {
    const docente = await this.registroService.getDocenteById(id);
    const data = {
      data: docente,
      message: 'Ok',
    };
    return data;
  }

  // ✅ OBTENER GRADOS POR DOCENTE
  @Get('/getGradosByDocenteId/:id')
  async getGradosByDocenteId(@Param('id', ParseIntPipe) id: number) {
    const docente = await this.registroService.getGradosByDocenteId(id);
    const data = {
      data: docente,
      message: 'Ok',
    };
    return data;
  }

  @Put('/:id')
  @UseInterceptors(
    FileInterceptor('foto_docente', {
      storage: imageStorage('docentes'),
      limits: { fileSize: IMAGE_MAX_SIZE },
      fileFilter: imageFileFilter,
    }),
    UploadCleanupInterceptor,
  )
  async editarDocente(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Req() req,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      await removeUploadedFile(file);
      return { message: 'Usuario no autenticado', statusCode: 401 };
    }

    await assertImageContent(file);

    // Parsear arrays y objetos
    const docenteDto: DocentesDTO = {
      ...body,
      sexo: JSON.parse(body.sexo),
      pais: JSON.parse(body.pais),
      municipio: JSON.parse(body.municipio),
      nivel_academico: JSON.parse(body.nivel_academico),
      profession: JSON.parse(body.profession),
      user_update_id: userId,
    };

    // Guardar foto si se sube una nueva
    if (file) docenteDto.foto_docente = `/uploads/docentes/${file.filename}`;

    const docente = await this.registroService.editDocente(id, docenteDto);
    return { data: docente, message: 'Docente actualizado correctamente' };
  }

  @Delete('/:id')
  async deleteDocente(@Param('id', ParseIntPipe) id: number, @Req() req) {
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
  }
}
