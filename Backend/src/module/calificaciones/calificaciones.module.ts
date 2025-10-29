import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EsquelaRow } from './esquelas_rows/esquelas_rows.entity';
import { EsquelaRowController } from './esquelas_rows/esquelas_rows.controller';
import { EsquelaRowService } from './esquelas_rows/esquelas_rows.service';

@Module({
  imports: [TypeOrmModule.forFeature([EsquelaRow])],
  controllers: [EsquelaRowController],
  providers: [EsquelaRowService],
})
export class CalificacionesModule { }
