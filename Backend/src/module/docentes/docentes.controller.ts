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
import { Utilities } from '../../common/helpers/utilities';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FormDataRequest } from 'nestjs-form-data';
import { get } from 'http';
import { UpdateDocentesDTO } from './updateDocentedto';

@ApiTags('Docentes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('docentes')
export class DocenteController {
  constructor(private readonly registroService: DocentesService) {}

  @Post('/')
  @UseInterceptors(
    FileInterceptor("foto_docente", {
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
  async createDocente(@Body() payload: DocentesDTO, 
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
      payload.user_create_id = userId;

      if (file) {
        payload.foto_docente = `/uploads/docentes/${file.filename}`
      }

      const docente = await this.registroService.createDocente(
        payload,
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

  // @Put('/:id')
  // @UseInterceptors(
  //   FileInterceptor("foto_docente", {
  //     storage: diskStorage({
  //       destination: "./uploads/docentes",
  //       filename: (req, file, cb) => {
  //         const uniqueSuffix =
  //           Date.now() + "-" + Math.round(Math.random() * 1e9);
  //         cb(null, uniqueSuffix + extname(file.originalname));
  //       },
  //     }),
  //   })
  // )
  // async editarDocente(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body('dto') dtoString: string,
  //   @Req() req, // Capturar el usuario autenticado
  //   @UploadedFile() file?: Express.Multer.File
  // ) {
  //   try {
  //     const userId = req.user?.id; // Obtener el ID del usuario autenticado

  //     if (!userId) {
  //       return {
  //         message: 'Usuario no autenticado',
  //         statusCode: 401,
  //       };
  //     }

  //     const payload: UpdateDocentesDTO = JSON.parse(dtoString);
  //     // Campos que sí se pueden actualizar
  //     const editableFields = [
  //     'nombres',
  //     'apellido_paterno',
  //     'apellido_materno',
  //     'sexo',
  //     'nivel_academico',
  //     'profession',
  //     'grupos',
  //     'telefono',
  //     'fecha_nacimiento',
  //     'pais',
  //     'municipio',
  //     'direccion_domiciliar',
  //     'cargo_nominal',
  //     'cargo_real',
  //     'unidad_administrativa',
  //   ];


  //    // Solo mantener los campos editables en el payload
  //     const filteredPayload: Partial<UpdateDocentesDTO> = {};
  //     editableFields.forEach((field) => {
  //     if (payload[field] !== undefined) filteredPayload[field] = payload[field];
  //   });

  //      // Si hay foto nueva, agregar al payload
  //       if (file) filteredPayload.foto_docente = `/uploads/docentes/${file.filename}`;

  //       // Registrar usuario que actualiza y fecha
  //   filteredPayload.user_update_id = userId;
  //   filteredPayload.update_at = new Date();

  //     const docente = await this.registroService.editDocente(id, filteredPayload);
  //     return {
  //       data: docente,
  //     message: 'Docente actualizado correctamente',
  //     };
  //   } catch (error) {
  //     Utilities.catchError(error);
  //   }
  // }

  @Put('/:id')
@UseInterceptors(
  FileInterceptor("foto_docente", {
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
  @Body() payload: Partial<UpdateDocentesDTO>,   // ✅ mejor tipado
  @Req() req,
  @UploadedFile() file: Express.Multer.File
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return { message: 'Usuario no autenticado', statusCode: 401 };
    }

    // Si hay foto
    if (file) {
      payload.foto_docente = `/uploads/docentes/${file.filename}`;
    }

    // Agregar el user_update_id
    payload.user_update_id = userId;

    const docente = await this.registroService.editDocente(id, payload);

    return {
      data: docente,
      message: 'Docente actualizado correctamente',
    };
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
