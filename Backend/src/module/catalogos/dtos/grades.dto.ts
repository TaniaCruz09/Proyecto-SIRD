import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";


export class GradesDto{
    @IsNumber()
    @IsOptional()
    readonly id: number;

    @IsString()
    @IsNotEmpty()
    readonly grades: string

    /*created_at: Date
    update_at: Date
    user_id: number
    user_update_id: number*/

}