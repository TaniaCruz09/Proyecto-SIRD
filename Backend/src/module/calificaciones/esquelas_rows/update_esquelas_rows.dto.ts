import { PartialType } from '@nestjs/swagger';
import { CreateEsquelaRowDto } from './esquelas_rows.dto';

export class UpdateCalificacioneDto extends PartialType(CreateEsquelaRowDto) { }
