import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserHasRolesDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @IsArray()
  roles: number[];
}
