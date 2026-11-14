import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Healthcheck público (Render lo consulta en /api/v1)
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
