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
import { StudentDocumentsService } from './student-documents.service';

@ApiTags('student-documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('student-documents')
export class StudentDocumentsController {
  constructor(
    private readonly documentsService: StudentDocumentsService,
  ) {}

  @Get()
  findByStudent(@Query('studentId', ParseIntPipe) studentId: number) {
    return this.documentsService.findByStudent(studentId);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: documentStorage('estudiantes'),
      limits: { fileSize: DOCUMENT_MAX_SIZE },
      fileFilter: documentFileFilter,
    }),
  )
  upload(
    @Body('studentId', ParseIntPipe) studentId: number,
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

    return this.documentsService.create(studentId, nombre, file, req.user?.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.remove(id);
  }
}
