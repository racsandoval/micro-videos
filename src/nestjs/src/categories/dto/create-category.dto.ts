import { CreateCategoryUseCase } from "@app/micro-videos/category/application";

export class CreateCategoryDto implements CreateCategoryUseCase.Input {
  name: string;
  description?: string;
  is_active?: boolean;
}
