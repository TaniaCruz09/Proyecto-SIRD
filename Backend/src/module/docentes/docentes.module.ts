import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Docentes } from './docentes.entity';
import { DocenteController } from './docentes.controller';
import { DocentesService } from './docentes.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MulterModule } from '@nestjs/platform-express';


@Module({
  imports: [TypeOrmModule.forFeature([Docentes]),
  MulterModule.register({
      storage: diskStorage({
        destination: './uploads/docentes', // 📂 Carpeta donde se guardarán las fotos
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
],
  controllers: [DocenteController],
  providers: [DocentesService],
})
export class DocentesModule {}
