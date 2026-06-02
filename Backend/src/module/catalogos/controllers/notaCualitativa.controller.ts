import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Utilities } from "src/common/helpers/utilities";
import { JwtAuthGuard } from "src/module/auth/guards/jwt.guard";
import { NotaCualitativaDto } from "../dtos/notaCualitativa.dto";
import { NotaCualitativaService } from "../services/notaCualitativa.service";

@ApiTags("notaCualitativa")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("notaCualitativa")
export class NotaCualitativaController {
  constructor(private readonly notaCualitativaService: NotaCualitativaService) {}

  @Post("/")
  async createNotaCualitativa(@Body() payload: NotaCualitativaDto, @Req() req) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return {
          message: "Usuario no autenticado",
          statusCode: 401,
        };
      }

      payload.user_create_id = userId;

      const newNota = await this.notaCualitativaService.created(payload);
      return {
        data: newNota,
        message: "Nota cualitativa creada correctamente",
      };
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  @Get("/")
  async getNotasCualitativas() {
    try {
      const notas = await this.notaCualitativaService.getNotasCualitativas();
      return {
        data: notas,
        message: "Notas cualitativas encontradas",
      };
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  @Get("/:id")
  async getNotaCualitativaById(@Param("id", ParseIntPipe) id: number) {
    try {
      const nota = await this.notaCualitativaService.getNotaCualitativaById(id);
      return {
        data: nota,
        message: "Nota cualitativa encontrada",
      };
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  @Put("/:id")
  async updateNotaCualitativa(
    @Param("id", ParseIntPipe) id: number,
    @Body() payload: NotaCualitativaDto,
    @Req() req,
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return {
          message: "Usuario no autenticado",
          statusCode: 401,
        };
      }

      payload.user_update_id = userId;

      const nota = await this.notaCualitativaService.updateNotaCualitativa(id, payload);
      return {
        data: nota,
        message: "Nota cualitativa actualizada correctamente",
      };
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  @Delete("/:id")
  async deleteNotaCualitativa(@Param("id", ParseIntPipe) id: number, @Req() req) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return {
          message: "Usuario no autenticado",
          statusCode: 401,
        };
      }

      const nota = await this.notaCualitativaService.deleteNotaCualitativa(id, userId);
      return {
        data: nota,
        message: "Nota cualitativa eliminada correctamente",
      };
    } catch (error) {
      Utilities.catchError(error);
    }
  }
}
