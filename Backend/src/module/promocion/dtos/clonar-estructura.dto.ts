import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class ClonarEstructuraDto {
  @ApiProperty({
    description: 'Año lectivo que se toma como base para copiar la estructura',
    example: 1,
  })
  @IsInt()
  anioOrigenId: number;

  @ApiProperty({
    description: 'Año lectivo nuevo que se va a crear',
    example: 2027,
  })
  @IsInt()
  @Min(2000)
  @Max(2100)
  anioDestino: number;
}
