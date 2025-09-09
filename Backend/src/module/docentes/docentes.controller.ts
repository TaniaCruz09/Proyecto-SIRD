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
} from '@nestjs/common';
import { DocentesService } from './docentes.service';
import { DocentesDTO } from './docentes.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Utilities } from '../../common/helpers/utilities';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@ApiTags('Docentes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('docentes')
export class DocenteController {
  constructor(private readonly registroService: DocentesService) {}

  @Post('/')
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination:"./uploads/docentes", // carpeta donde se guardan las fotos
        filename: (Req, file, cb ) => {
          const uniqueSuffix = Date.now() + "-" + Math.round (
            Math.random() * 1e9);
            cb(null, uniqueSuffix + extname ( file.originalname))

        }
      })
    })
  )
  async createDocente(@Body() createDocenteDto: DocentesDTO, 
  @Req() req, 
  @UploadedFile() file: Express.Multer.File) {
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

      if (file) {
        createDocenteDto.foto_docente = `/uploads/docentes/${file.filename}`
      }

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

  // Obtener datos del docente logueado
@UseGuards(JwtAuthGuard)
@Get('me')
async getMiDocente(@Req() req: any) {
  try {
    const userId = req.user?.id; // ID del usuario logueado
    if (!userId) {
      return {
        message: 'Usuario no autenticado',
        statusCode: 401,
      };
    }

    const docente = await this.registroService.getDocenteByUserId(userId);

    return {
      data: docente,
      message: 'Datos obtenidos correctamente',
    };
  } catch (error) {
    Utilities.catchError(error);
  }
}


  // 📌 Subir foto de perfil
  // @Post(':id/foto')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFoto(
  //   @Param('id', ParseIntPipe) id: number,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {

  //   if (!file) {
  //     return {
  //       message: "No se subio ningun archivo",
  //       statusCode: 400,
  //     };
  //   }
      
  //   return this.registroService.updateFoto(id, file.filename); // 👈 corregido
  // }
//   @Post(':id/foto')
// @UseInterceptors(
//   FileInterceptor('file', {
//     storage: diskStorage({
//       destination: './src/docentes/fotoDocente', // Carpeta donde se guardarán las fotos
//       filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         const ext = extname(file.originalname); // Extensión original
//         cb(null, `foto-${uniqueSuffix}${ext}`);
//       },
//     }),
//   }),
// )
// async uploadFoto(
//   @Param('id', ParseIntPipe) id: number,
//   @UploadedFile() file?: Express.Multer.File,
// ) {
//   if (!file) {
//     return {
//       message: 'No se subió ningún archivo',
//       statusCode: 400,
//     };
//   }

//   return this.registroService.updateFoto(id, file.filename);
// }


  
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

  @Put('/:id')
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/docentes",
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    })
  )
  async editarDocente(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: DocentesDTO,
    @Req() req, // Capturar el usuario autenticado
    @UploadedFile() file: Express.Multer.File
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

       if (file) {
        payload.foto_docente = `/uploads/docentes/${file.filename}`;
      }

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
