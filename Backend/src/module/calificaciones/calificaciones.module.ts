import { Module } from '@nestjs/common';
import { CalificacionesService } from './calificaciones.service';
import { CalificacionesController } from './calificaciones.controller';
import { Calificaciones } from './entities/calificacion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EsquelaHeadEntity } from './esquela_head/entities/squela_head.entity';
import { EsquelaHeadController } from './esquela_head/esquela_head.controller';
import { EsquelaHeadService } from './esquela_head/squela_head.service';

@Module({
  imports: [TypeOrmModule.forFeature([Calificaciones, EsquelaHeadEntity])] ,
  controllers: [CalificacionesController, EsquelaHeadController],
  providers: [CalificacionesService,EsquelaHeadService ],
})
export class CalificacionesModule {}
