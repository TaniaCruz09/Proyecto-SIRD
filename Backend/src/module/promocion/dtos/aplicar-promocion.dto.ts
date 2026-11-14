import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class DecisionPromocionDto {
  @ApiProperty({ description: 'Estudiante a mover', example: 2 })
  @IsInt()
  estudianteId: number;

  @ApiPropertyOptional({
    description:
      'Grupo destino. Si se omite o es null, el estudiante no se inscribe (no continúa).',
    example: 12,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  destinoGrupoId?: number | null;
}

export class AplicarPromocionDto {
  @ApiProperty({ description: 'Grupo del año anterior', example: 1 })
  @IsInt()
  grupoOrigenId: number;

  @ApiProperty({ description: 'Año lectivo destino', example: 5 })
  @IsInt()
  anioDestinoId: number;

  @ApiProperty({
    description: 'Decisión por cada estudiante del grupo de origen',
    type: [DecisionPromocionDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DecisionPromocionDto)
  decisiones: DecisionPromocionDto[];
}
