import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { GradesService } from "../services/grades.service";
import { GradesDto } from "../dtos/grades.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Utilities } from "src/common/helpers/utilities";
import { JwtAuthGuard } from "src/module/auth/guards/jwt.guard";

@ApiTags('Grades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('grades')
export class GradesController{
    constructor (private readonly gradesService: GradesService){}

    @Post ('/')
    async createGrades(@Body() payload: GradesDto){
        try{
            const newGrades = await this.gradesService.created(payload);
            const data = {
                data: newGrades,
                message: 'created',
            }
            return data;
        }catch(error){
            Utilities.catchError(error)
        }
    }

    @Get('/')
    async getGrades(){ 
        try{
            const grades = await this.gradesService.getGrades();
            const data = {
                data : grades,
                message: 'ok',
            };
            return data;
        }catch(error){
            Utilities.catchError(error)
        }
    }

    @Get('/:id')
    async getGradesById(@Param('id', ParseIntPipe) id: number){
        try{
            const grades = await this.gradesService.getGradesById(id);
    
            const data = {
                data:grades,
                message: 'all ok',
            };
            return data;
        }catch(error){
            Utilities.catchError(error)
        }
    }

    @Put('/:id')
    async updateGrades(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: GradesDto,
    ){
        try{
            const grades= await this.gradesService.updateGrades(id, payload);
            const data = {
                data: grades,
            }
            return data;
        }catch(error){
            Utilities.catchError(error)
        }
    }

    @Delete('/:id')
    async deleteGrades(@Param('id',ParseIntPipe) id:number ) {
        try{
            const grades = await this.gradesService.deleteGrades(id);
            const data = {
                data: grades,
                message: 'grade deleted',
            };
            return data;
        }catch(error){
            Utilities.catchError(error)
        }
    }
}