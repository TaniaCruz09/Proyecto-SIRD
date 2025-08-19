
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class AsignarEstudiantesDto {
    @IsInt()
    @IsNotEmpty()
    organizacionEscolarId: number;

    @IsArray()
    @IsInt({ each: true })
    estudianteIds: number[];

}
