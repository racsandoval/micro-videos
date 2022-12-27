import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCategoryUseCase } from '@app/micro-videos/category/application';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    console.log(CreateCategoryUseCase)
    return this.appService.getHello();
  }
}
