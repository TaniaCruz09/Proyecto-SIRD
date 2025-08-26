// import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
// import { create } from "domain";
// import { OrganizacionEscolarConAsignaturaDto } from "../dtos/organizacionEscolarAsignatura.dto";
// import { Utilities } from "src/common/helpers/utilities";
// import { OrganizacionEscolarConAsignaturaService } from "../services/organizacionEscolarAsignatura.service";
// import { JwtAuthGuard } from "src/module/auth/guards/jwt.guard";
// import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

// @ApiTags('OrganizacionEscolarAsignatura')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
// @Controller('organizacion-escolar-con-asignatura')
// export class OrganizacionEscolarConAsignaturaController {
//     constructor(private readonly organizacionEscolarAsignaturasService: OrganizacionEscolarConAsignaturaService) { }

//     @Post('/')
//     async createOrganizacionEscolarConAsignatura(@Body() createOrganizacionEscolarConAsignatura: OrganizacionEscolarConAsignaturaDto, @Req() req) {
//         try {
//             const userId = req.user?.id; // Obtener el ID del usuario autenticado

//             if (!userId) {
//                 return {
//                     message: 'Usuario no autenticado',
//                     statusCode: 401,
//                 };
//             }

//             // Agregar el user_create_id al payload
//             createOrganizacionEscolarConAsignatura.user_create_id = userId;

//             const organizacionEscolarConAsignatura = await this.organizacionEscolarAsignaturasService.createOrganizacionEscolarConAsignatura(
//                 createOrganizacionEscolarConAsignatura,
//             );
//             const data = {
//                 data: organizacionEscolarConAsignatura,
//                 message: 'Organización escolar con asignatura agregada correctamente',
//             };
//             return data;
//         } catch (error) {
//             Utilities.catchError(error);
//         }
//     }


//     @Get()
//     async getOrganizacionEscolarConAsignatura() {
//         try {
//             const organizacionEscolarConAsignatura = await this.organizacionEscolarAsignaturasService.getOrganizacionEscolarConAsignatura();
//             const data = {
//                 data: organizacionEscolarConAsignatura,
//                 message: 'Ok',
//             };
//             return data;
//         } catch (error) {
//             Utilities.catchError(error);
//         }
//     }


//     @Get('/:id')
//     async getOrganizacionEscolarConAsignaturaById(@Param('id', ParseIntPipe) id: number) {
//         try {
//             const organizacionEscolarConAsignatura = await this.organizacionEscolarAsignaturasService.getOrganizacionEscolarConAsignaturaById(id);
//             if (!organizacionEscolarConAsignatura) {
//                 return {
//                     message: 'Organización escolar con asignatura no encontrada',
//                     statusCode: 404,
//                 };
//             }
//             const data = {
//                 data: organizacionEscolarConAsignatura,
//                 message: 'Ok',
//             };
//             return data;
//         } catch (error) {
//             Utilities.catchError(error);
//         }
//     }

//     @Put('/:id')
//     async editarOrganizacionEscolarConAsignatura(
//         @Param('id', ParseIntPipe) id: number,
//         @Body() payload: OrganizacionEscolarConAsignaturaDto,
//         @Req() req,
//     ) {
//         try {
//             const userId = req.user?.id; // Obtener el ID del usuario autenticado

//             if (!userId) {
//                 return {
//                     message: 'Usuario no autenticado',
//                     statusCode: 401,
//                 };
//             }

//             // Agregar el user_update_id al payload
//             payload.user_update_id = userId;
//             const organizacionEscolarConAsignatura = await this.organizacionEscolarAsignaturasService.updateOrganizacionEscolarConAsignatura(id, payload);
//             if (!organizacionEscolarConAsignatura) {
//                 return {
//                     message: 'Organización escolar con asignatura no encontrada',
//                     statusCode: 404,
//                 };
//             }
//             const data = {
//                 data: organizacionEscolarConAsignatura,
//                 message: 'Organización escolar con asignatura actualizada correctamente',
//             };
//             return data;

//         } catch (error) {
//             Utilities.catchError(error);

//         }
//     }
//     @Delete('/:id')
//     async deleteOrganizacionEscolarConAsignatura(@Param('id', ParseIntPipe) id: number, @Req() req) {
//         try {
//             const userId = req.user?.id; // Obtener el ID del usuario autenticado

//             if (!userId) {
//                 return {
//                     message: 'Usuario no autenticado',
//                     statusCode: 401,
//                 };
//             }

//             const organizacionEscolarConAsignatura = await this.organizacionEscolarAsignaturasService.deleteOrganizacionEscolarConAsignatura(id, userId);
//             if (!organizacionEscolarConAsignatura) {
//                 return {
//                     message: 'Organización escolar con asignatura no encontrada',
//                     statusCode: 404,
//                 };
//             }
//             const data = {
//                 data: organizacionEscolarConAsignatura,
//                 message: 'Organización escolar con asignatura eliminada correctamente',
//             };
//             return data;
//         } catch (error) {
//             Utilities.catchError(error);
//         }
//     }
// }