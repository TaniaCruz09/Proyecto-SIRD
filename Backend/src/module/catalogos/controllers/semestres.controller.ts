import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/module/auth/guards/jwt.guard";
import { SemestreDto } from "../dtos/semestres.dto";
import { SemestreService } from "../services/semestre.service";
import { Utilities } from "src/common/helpers/utilities";


@ApiTags('semestre')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('semestre')
export class SemestreController{

    constructor(private readonly SemestreService: SemestreService ){}

    @Post('/')
    async createdSemestre(@Body() payload: SemestreDto, @Req() req){
        try{
            const userId = req.user?.id;

            if(!userId){
                return{
                    message: 'usuario no autenticado',
                    statusCode: 401
                }
            }
            payload.user_create_id = userId;

            const newSemestre = await this.SemestreService.created(payload);
            const data ={
                data: newSemestre,
                message: 'created'
            }
            return data;
        }catch (error){
            Utilities.catchError(error)
        }
    }

    @Get('/')
      async getSemestres() {
        try {
    
          const semestre = await this.SemestreService.getSemestres();
          const data = {
            data: semestre,
            message: 'Ok',
          };
    
          return data;
        } catch (error) {
          Utilities.catchError(error)
        }
      }

       @Get('/:id')
        async getSemestreById(@Param('id', ParseIntPipe) id: number) {
          try {
      
            const semestre = await this.SemestreService.getSemestreById(id);
      
            const data = {
              data: semestre,
              message: 'Ok',
            };
      
            return data;
          } catch (error) {
            Utilities.catchError(error)
          }
        }

        @Put('/:id')
          async update(
            @Param('id', ParseIntPipe) id: number,
            @Body() payload: SemestreDto,
            @Req() req // Capturar el usuario autenticado
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
        
              const semestre = await this.SemestreService.updateSemestre(id, payload);
              return {
                data: semestre,
                message: 'Semestre actualizado correctamente',
              };
            } catch (error) {
              Utilities.catchError(error);
            }
          }

          @Delete('/:id')
            async deleteSemestre(
              @Param('id', ParseIntPipe) id: number,
              @Req() req
            ) {
              try {
                const userId = req.user?.id; // Obtener el ID del usuario autenticado
          
                if (!userId) {
                  return {
                    message: "Usuario no autenticado",
                    statusCode: 401
                  };
                }
                const sementre = await this.SemestreService.deleteSemestre(id, userId);
          
                return {
                  data: sementre,
                  message: 'sementre marked as deleted',
                };
              } catch (error) {
                Utilities.catchError(error);
              }
            }
          
    
}