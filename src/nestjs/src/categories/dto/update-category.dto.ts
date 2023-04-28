import { UpdateCategoryUseCase } from '@app/micro-videos/category/application';

export class UpdateCategoryDto implements Omit<UpdateCategoryUseCase.Input, 'id'> {
  name: string;
  description?: string;
  is_active?: boolean;
}
