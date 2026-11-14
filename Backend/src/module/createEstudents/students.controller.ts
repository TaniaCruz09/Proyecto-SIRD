import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { StudentsDto } from "./student.dto";
import { StudentService } from "./students.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FiltrarEstudiantesDto } from "./FiltrarEstudiantesDto";
import { FileInterceptor } from "@nestjs/platform-express";
import {
    IMAGE_MAX_SIZE,
    imageFileFilter,
    imageStorage,
} from "../../common/uploads/image-upload";
import { removeUploadedFile } from "../../common/uploads/upload-cleanup";
import { UploadCleanupInterceptor } from "../../common/uploads/upload-cleanup.interceptor";
import { assertImageContent } from "../../common/uploads/upload-validation";

@ApiTags('student')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) { }

    @Post('/')
    @UseInterceptors(
        FileInterceptor("profileImage", {
            storage: imageStorage('students'),
            limits: { fileSize: IMAGE_MAX_SIZE },
            fileFilter: imageFileFilter,
        }),
        UploadCleanupInterceptor
    )
    async createStudent(
        @Body() payload: StudentsDto,
        @Req() req,
        @UploadedFile() file: Express.Multer.File
    ) {
        const userId = req.user?.id; // Obtener el ID del usuario autenticado

        if (!userId) {
            await removeUploadedFile(file);
            return {
                message: "Usuario no autenticado",
                statusCode: 401
            };
        }

        await assertImageContent(file);

        // Agregar el user_update_id al payload
        payload.user_create_id = userId;

        if (file) {
            payload.profileImage = `/uploads/students/${file.filename}`
        }

        const newStudent = await this.studentService.created(payload);
        const data = {
            data: newStudent,
            message: 'Estudiante agregado correctamente',
        }
        return data;
    }

    @Get('/')
    async getStudent() {
        const student = await this.studentService.getStudent();
        const data = {
            data: student,
            message: 'ok',
        };
        return data;
    }

    @Get('/filtrar')
    async filtrarEstudiantes(@Query() filtro: FiltrarEstudiantesDto) {
        return this.studentService.filtrarEstudiantes(filtro, filtro.anioId);
    }

    @Get('/existe')
    async existe(
        @Query('cedula') cedula?: string,
        @Query('codigo') codigo?: string,
        @Query('excluirId') excluirId?: string,
    ) {
        const duplicado = await this.studentService.existeConflicto({
            cedula,
            codigo,
            excluirId: excluirId ? Number(excluirId) : undefined,
        });

        return {
            data: {
                existe: Boolean(duplicado),
                campo: duplicado?.campo ?? null,
                valor: duplicado?.valor ?? null,
            },
            message: 'ok',
        };
    }

    @Get('/:id')
    async getStudentById(@Param('id', ParseIntPipe) id: number) {
        const student = await this.studentService.getStudentById(id);
        const data = {
            data: student,
            message: 'ok',
        };
        return data;
    }

    @Put('/:id')
    @UseInterceptors(
        FileInterceptor("profileImage", {
            storage: imageStorage('students'),
            limits: { fileSize: IMAGE_MAX_SIZE },
            fileFilter: imageFileFilter,
        }),
        UploadCleanupInterceptor
    )
    async updateStudent(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: StudentsDto,
        @Req() req, // Capturar el usuario 
        @UploadedFile() file: Express.Multer.File
    ) {
        const userId = req.user?.id; // Obtener el ID del usuario autenticado

        if (!userId) {
            await removeUploadedFile(file);
            return {
                message: "Usuario no autenticado",
                statusCode: 401
            };
        }

        await assertImageContent(file);

        // Agregar el user_update_id al payload
        payload.user_update_id = userId;

        if (file) {
            payload.profileImage = `/uploads/students/${file.filename}`;
        }

        const student = await this.studentService.updateStudent(id, payload);
        return {
            data: student,
            message: 'Estudiante actualizado correctamente',
        };
    }

    @Delete('/:id')
    async deleteStudent(@Param('id', ParseIntPipe) id: number, @Req() req) {
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
            message: 'Estudent marked as deleted',
        };
    }
}