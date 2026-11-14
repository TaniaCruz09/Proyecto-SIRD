import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { GradesService } from "../services/grades.service";
import { GradesDto } from "../dtos/grades.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/module/auth/guards/jwt.guard";
import { AdminWrite } from '../../../common/decorators/admin-write.decorator';

@ApiTags('Grades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@AdminWrite()
@Controller('grades')
export class GradesController{
    constructor (private readonly gradesService: GradesService){}

    @Post ('/')
    async createGrades(@Body() payload: GradesDto){
        const newGrades = await this.gradesService.created(payload);
        const data = {
            data: newGrades,
            message: 'created',
        }
        return data;
    }

    @Get('/')
    async getGrades(){ 
        const grades = await this.gradesService.getGrades();
        const data = {
            data : grades,
            message: 'ok',
        };
        return data;
    }

    @Get('/:id')
    async getGradesById(@Param('id', ParseIntPipe) id: number){
        const grades = await this.gradesService.getGradesById(id);

        const data = {
            data:grades,
            message: 'all ok',
        };
        return data;
    }

    @Put('/:id')
    async updateGrades(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: GradesDto,
    ){
        const grades= await this.gradesService.updateGrades(id, payload);
        const data = {
            data: grades,
        }
        return data;
    }

    @Delete('/:id')
    async deleteGrades(@Param('id',ParseIntPipe) id:number, @Req() req) {
        const userId = req.user?.id;
        const grades = await this.gradesService.deleteGrades(id, userId);
        const data = {
            data: grades,
            message: 'grade deleted',
        };
        return data;
    }
}