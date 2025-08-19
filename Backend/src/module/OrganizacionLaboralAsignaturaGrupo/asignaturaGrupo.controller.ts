// import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
// import { Utilities } from "src/common/helpers/utilities";
// import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
// import { JwtAuthGuard } from "src/module/auth/guards/jwt.guard";
// import { OrganizacionLaboralAsignaturaGrupoDto } from "./asignaturaGrupo.dto";
// import { AsignaturaGrupoService } from "./asignaturaGrupo.service";



// @ApiTags('asignaturaGrupo')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
// @Controller('asignaturaGrupo')
// export class AsignaturaGrupoController {
//     constructor(private readonly asignaturasGrupoService: AsignaturaGrupoService) { }

//     @Post('/')
//     async createAsiganturaGrupo(@Body() createAsignaturaGrupoDto: OrganizacionLaboralAsignaturaGrupoDto, @Req() req) {
//         try {
//             const userId = req.user?.id; // Obtener el ID del usuario autenticado

//             if (!userId) {
//                 return {
//                     message: 'Usuario no autenticado',
//                     statusCode: 401,
//                 };
//             }

//             // Agregar el user_create_id al payload
//             createAsignaturaGrupoDto.user_create_id = userId;

//             const asignaturasGrupo = await this.asignaturasGrupoService.createAsiganturaGrupo(
//                 createAsignaturaGrupoDto,
//             );
//             const data = {
//                 data: asignaturasGrupo,
//                 message: 'asignatura a grupos agregada correctamente ',
//             };
//             return data;
//         } catch (error) {
//             Utilities.catchError(error);
//         }
//     }

//     @Get('/')
//     async getAsignaturaGrupos() {
//         try {
//             const asignaturasGrupos = await this.asignaturasGrupoService.getAsignaturaGrupos();
//             const data = {
//                 data: asignaturasGrupos,
//                 message: 'Ok',
//             };
//             return data;
//         } catch (error) {
//             Utilities.catchError(error);
//         }
//     }

//     @Get('/:id')
//     async getAsignaturaGruposById(@Param('id', ParseIntPipe) id: number) {
//         try {
//             const asignaturasGrupos = await this.asignaturasGrupoService.getAsignaturaGruposById(id);
//             const data = {
//                 data: asignaturasGrupos,
//                 message: 'Ok',
//             };
//             return data;
//         } catch (error) {
//             Utilities.catchError(error);
//         }
//     }

//     @Put('/:id')
//     async updateAignaturaGrupo(
//         @Param('id', ParseIntPipe) id: number,
//         @Body() updateasignaturasGruposAsignaturaGruposDto: OrganizacionLaboralAsignaturaGrupoDto,
//         @Req() req
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
//             updateasignaturasGruposAsignaturaGruposDto.user_update_id = userId;
//             const asignaturasGrupos = await this.asignaturasGrupoService.updateAsignaturasEnGrupos(id, updateasignaturasGruposAsignaturaGruposDto);
//             const data = {
//                 data: asignaturasGrupos,
//                 message: 'Asignatura a grupos actualizada correctamente',
//             };
//             return data;
//         } catch (error) {
//             Utilities.catchError(error);
//         }
//     }

//     @Delete('/:id')
//     async deleteAsignaturaGrupo(@Param('id', ParseIntPipe) id: number, @Req() req) {
//         try {
//             const userId = req.user?.id; // Obtener el ID del usuario autenticado

//             if (!userId) {
//                 return {
//                     message: 'Usuario no autenticado',
//                     statusCode: 401,
//                 };
//             }

//             const asignaturasGrupos = await this.asignaturasGrupoService.deleteAsignaturaGrupo(id, userId);
//             const data = {
//                 data: asignaturasGrupos,
//                 message: 'asignatura a grupos eliminada correctamente',
//             };
//             return data;
//         } catch (error) {
//             Utilities.catchError(error);
//         }
//     }
//     }