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
// import { diskStorage } from 'Multer';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@ApiTags('Docentes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('docentes')
export class DocenteController {
  constructor(private readonly registroService: DocentesService) { }

  // @Post('/')
  // @UseInterceptors(
  //         FileInterceptor("foto_docente", {
  //             storage: diskStorage({
  //                 destination: "./uploads/docentes", //carpeta donde se guardan las fotos
  //                 filename: (req, file, cb) => {
  //                     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  //                     cb(null, uniqueSuffix + extname(file.originalname))
  //                 }
  //             })
  //         })
  //     )
  // async createDocente(  
  //   @UploadedFile() file: Express.Multer.File, 
  //   @Body() createDocenteDto: DocentesDTO, 
  //   @Req() req) {

  //    console.log('📸 Archivo recibido:', file); // 👈 AGREGA ESTO
     
  //   try {
  //     const userId = req.user?.id; // Obtener el ID del usuario autenticado

  //     if (!userId) {
  //       return {
  //         message: 'Usuario no autenticado',
  //         statusCode: 401,
  //       };
  //     }

  //     // Agregar el user_update_id al payload
  //     createDocenteDto.user_create_id = userId;

  //       // 👇 si hay foto, guardamos el nombre en el DTO
  //   if (file) {
  //     createDocenteDto.foto_docente = `uploads/docentes/${file.filename}`;
  //   }

  //     const docente = await this.registroService.createDocente(
  //       createDocenteDto,
  //     );
  //     const data = {
  //       data: docente,
  //       message: 'Docente agregado correctamente ',
  //     };
  //     return data;
  //   } catch (error) {
  //     Utilities.catchError(error);
  //   }
  // }

  @Post('/')
@UseInterceptors(
  FileInterceptor('foto_docente', {
    storage: diskStorage({
      destination: './uploads/docentes',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async createDocente(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: any, // <--- recibe FormData como any
  @Req() req,
) {

  try {
    const userId = req.user?.id;
    if (!userId) return { message: 'Usuario no autenticado', statusCode: 401 };

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
    if (file) docenteDto.foto_docente = `uploads/docentes/${file.filename}`;
    console.log("📸 Ruta de la foto asignada al DTO:", docenteDto.foto_docente);


    const docente = await this.registroService.createDocente(docenteDto);
    console.log("📸 Nueva ruta de la foto asignada al DTO:", docenteDto.foto_docente);
    return { data: docente, message: 'Docente agregado correctamente' };
  } catch (error) {
    Utilities.catchError(error);
  }
}



  @Get('/')
  async getDocente() {
    try {
      const docente = await this.registroService.getDocente();
       console.log('📦 Docentes obtenidos del backend:', docente); // 👈 aquí
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

  // ✅ OBTENER GRADOS POR DOCENTE
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

  // ✅ EDITAR DOCENTE  
  // @Put('/:id')
  // @UseInterceptors(
  //       FileInterceptor("foto_docente", {
  //           storage: diskStorage({
  //               destination: "./uploads/docentes",
  //               filename: (req, file, cb) => {
  //                   const uniqueSuffix =
  //                       Date.now() + "-" + Math.round(Math.random() * 1e9);
  //                   cb(null, uniqueSuffix + extname(file.originalname));
  //               },
  //           }),
  //       })
  //   )
  // async editarDocente(
  //   @Param('id', ParseIntPipe) id: number,
  //    @UploadedFile() file: Express.Multer.File,
  //   @Body() payload: DocentesDTO,
  //   @Req() req, // Capturar el usuario autenticado
  // ) {
  //   try {
  //     const userId = req.user?.id; // Obtener el ID del usuario autenticado

  //     if (!userId) {
  //       return {
  //         message: 'Usuario no autenticado',
  //         statusCode: 401,
  //       };
  //     }

  //     // Agregar el user_update_id al payload
  //     payload.user_update_id = userId;

  //       // 👇 Si sube nueva foto, actualizarla
  //   if (file) {
  //     payload.foto_docente = `uploads/docentes/${file.filename}`;
  //   }

  //     const docente = await this.registroService.editDocente(id, payload);
  //     const data = {
  //       data: docente,
  //       message: 'Docente actualizado correctamente',
  //     };
  //     return data;
  //   } catch (error) {
  //     Utilities.catchError(error);
  //   }
  // }

  @Put('/:id')
@UseInterceptors(
  FileInterceptor('foto_docente', {
    storage: diskStorage({
      destination: './uploads/docentes',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async editarDocente(
  @Param('id', ParseIntPipe) id: number,
  @UploadedFile() file: Express.Multer.File,
  @Body() body: any,
  @Req() req,
) {
  try {
    const userId = req.user?.id;
    if (!userId) return { message: 'Usuario no autenticado', statusCode: 401 };

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
    if (file) docenteDto.foto_docente = `uploads/docentes/${file.filename}`;

    const docente = await this.registroService.editDocente(id, docenteDto);
    return { data: docente, message: 'Docente actualizado correctamente' };
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
