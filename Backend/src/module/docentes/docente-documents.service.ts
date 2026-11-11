import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { DocenteDocument } from './docente-document.entity';

@Injectable()
export class DocenteDocumentsService {
  constructor(
    @InjectRepository(DocenteDocument)
    private readonly documentsRepo: Repository<DocenteDocument>,
  ) {}

  findByDocente(docenteId: number): Promise<DocenteDocument[]> {
    return this.documentsRepo.find({
      where: { docente: { id: docenteId } },
      order: { createdAt: 'DESC' },
    });
  }

  create(
    docenteId: number,
    nombre: string,
    file: Express.Multer.File,
    userId?: number,
  ): Promise<DocenteDocument> {
    const document = this.documentsRepo.create({
      nombre: nombre.trim(),
      archivo: `/uploads/documentos/docentes/${file.filename}`,
      tipo: file.mimetype,
      tamano: file.size,
      docente: { id: docenteId },
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
