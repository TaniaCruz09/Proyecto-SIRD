import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { StudentsDto } from "./student.dto";
import { StudentService } from "./students.service";
import { Utilities } from "../../common/helpers/utilities";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FiltrarEstudiantesDto } from "./FiltrarEstudiantesDto";

@ApiTags('student')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) { }

    @Post('/')
    async createStudent(@Body() payload: StudentsDto, @Req() req) {
        try {
            const userId = req.user?.id; // Obtener el ID del usuario autenticado

            if (!userId) {
                return {
                    message: "Usuario no autenticado",
                    statusCode: 401
                };
            }

            // Agregar el user_update_id al payload
            payload.user_create_id = userId;
            const newStudent = await this.studentService.created(payload);
            const data = {
                data: newStudent,
                message: 'Estudiante agregado correctamente',
            }
            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Get('/')
    async getStudent() {
        try {
            const student = await this.studentService.getStudent();
            const data = {
                data: student,
                message: 'ok',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Get('/filtrar')
    async filtrarEstudiantes(@Query() filtro: FiltrarEstudiantesDto) {
        console.log('Filtro recibido:', filtro);
        return this.studentService.filtrarEstudiantes(filtro);
    }

    @Get('/:id')
    async getStudentById(@Param('id', ParseIntPipe) id: number) {
        try {
            const student = await this.studentService.getStudentById(id);
            const data = {
                data: student,
                message: 'ok',
            };
            return data;
        } catch (error) {
            Utilities.catchError(error)
        }
    }


    @Put('/:id')
    async updateStudent(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: StudentsDto,
        @Req() req // Capturar el usuario 
    ) {
        try {
            const userId = req.user?.id; // Obtener el ID del usuario autenticado

            if (!userId) {
                return {
                    message: "Usuario no autenticado",
                    statusCode: 401
                };
            }

            // Agregar el user_update_id al payload
            payload.user_update_id = userId;
            const student = await this.studentService.updateStudent(id, payload);
            return {
                data: student,
                message: 'Estudiante actualizado correctamente',
            };
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    @Delete('/:id')
    async deleteStudent(@Param('id', ParseIntPipe) id: number, @Req() req) {
        try {
            const userId = req.user?.id; // Obtener el ID del usuario autenticado

            if (!userId) {
                return {
                    message: "Usuario no autenticado",
                    statusCode: 401
                };
            }
            const student = await this.studentService.deleteStudent(id, userId);
            return {
                data: student,
                message: 'Profession marked as deleted',
            };
        } catch (error) {
            Utilities.catchError(error)
        }
    }
}