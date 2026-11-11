import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  DOCUMENT_MAX_SIZE,
  documentFileFilter,
  documentStorage,
} from '../../common/uploads/document-upload';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { DocenteDocumentsService } from './docente-documents.service';

@ApiTags('docente-documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('docente-documents')
export class DocenteDocumentsController {
  constructor(
    private readonly documentsService: DocenteDocumentsService,
  ) {}

  @Get()
  findByDocente(@Query('docenteId', ParseIntPipe) docenteId: number) {
    return this.documentsService.findByDocente(docenteId);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: documentStorage('docentes'),
      limits: { fileSize: DOCUMENT_MAX_SIZE },
      fileFilter: documentFileFilter,
    }),
  )
  upload(
    @Body('docenteId', ParseIntPipe) docenteId: number,
    @Body('nombre') nombre: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    if (!file) {
      throw new BadRequestException('Debes adjuntar un archivo');
    }
    if (!nombre?.trim()) {
      throw new BadRequestException('El nombre del documento es obligatorio');
    }

    return this.documentsService.create(docenteId, nombre, file, req.user?.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.remove(id);
  }
}
