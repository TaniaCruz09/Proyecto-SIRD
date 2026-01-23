import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EsquelaRow } from './esquelas_rows/esquelas_rows.entity';
import { EsquelaRowController } from './esquelas_rows/esquelas_rows.controller';
import { EsquelaRowService } from './esquelas_rows/esquelas_rows.service';
import { EsquelaHeadEntity } from './esquela_head/entities/squela_head.entity';
import { EsquelaHeadController } from './esquela_head/esquela_head.controller';
import { EsquelaHeadService } from './esquela_head/squela_head.service';

@Module({
  imports: [TypeOrmModule.forFeature([EsquelaRow, EsquelaHeadEntity])],
  controllers: [EsquelaRowController, EsquelaHeadController],
  providers: [EsquelaRowService, EsquelaHeadService],
  exports: [TypeOrmModule],
})
export class CalificacionesModule { }
