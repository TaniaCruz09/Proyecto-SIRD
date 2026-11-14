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
import { JwtAuthGuard } from "src/module/auth/guards/jwt.guard";
import { NotaCualitativaDto } from "../dtos/notaCualitativa.dto";
import { NotaCualitativaService } from "../services/notaCualitativa.service";
import { AdminWrite } from '../../../common/decorators/admin-write.decorator';

@ApiTags("notaCualitativa")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@AdminWrite()
@Controller("notaCualitativa")
export class NotaCualitativaController {
  constructor(private readonly notaCualitativaService: NotaCualitativaService) {}

  @Post("/")
  async createNotaCualitativa(@Body() payload: NotaCualitativaDto, @Req() req) {
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
  }

  @Get("/")
  async getNotasCualitativas() {
    const notas = await this.notaCualitativaService.getNotasCualitativas();
    return {
      data: notas,
      message: "Notas cualitativas encontradas",
    };
  }

  @Get("/:id")
  async getNotaCualitativaById(@Param("id", ParseIntPipe) id: number) {
    const nota = await this.notaCualitativaService.getNotaCualitativaById(id);
    return {
      data: nota,
      message: "Nota cualitativa encontrada",
    };
  }

  @Put("/:id")
  async updateNotaCualitativa(
    @Param("id", ParseIntPipe) id: number,
    @Body() payload: NotaCualitativaDto,
    @Req() req,
  ) {
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
  }

  @Delete("/:id")
  async deleteNotaCualitativa(@Param("id", ParseIntPipe) id: number, @Req() req) {
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
  }
}
