import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { StudentDocument } from './student-document.entity';

@Injectable()
export class StudentDocumentsService {
  constructor(
    @InjectRepository(StudentDocument)
    private readonly documentsRepo: Repository<StudentDocument>,
  ) {}

  findByStudent(studentId: number): Promise<StudentDocument[]> {
    return this.documentsRepo.find({
      where: { student: { id: studentId } },
      order: { createdAt: 'DESC' },
    });
  }

  create(
    studentId: number,
    nombre: string,
    file: Express.Multer.File,
    userId?: number,
  ): Promise<StudentDocument> {
    const document = this.documentsRepo.create({
      nombre: nombre.trim(),
      archivo: `/uploads/documentos/estudiantes/${file.filename}`,
      tipo: file.mimetype,
      tamano: file.size,
      student: { id: studentId },
      userCreateId: userId ?? null,
    });

    return this.documentsRepo.save(document);
  }

  async remove(id: number): Promise<{ message: string }> {
    const document = await this.documentsRepo.findOne({ where: { id } });

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    await this.documentsRepo.remove(document);
    await this.deleteFile(document.archivo);

    return { message: 'Documento eliminado correctamente' };
  }

  private async deleteFile(archivo?: string): Promise<void> {
    if (!archivo) return;

    try {
      const relative = archivo.replace(/^\/uploads\//, '');
      await unlink(join(process.cwd(), 'uploads', relative));
    } catch {
      // El archivo ya no existe en disco: no hay nada que borrar.
    }
  }
}
