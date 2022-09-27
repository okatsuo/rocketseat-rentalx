import { inject, injectable } from "tsyringe";

import { ICategoriesRepository } from "@modules/cars/infra/typeorm/repositories/ICategoriesRepository";
import { AppError } from "@shared/errors/AppError";

type IRequest = {
  name: string;
  description: string;
};

@injectable()
export class CreateCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute({ name, description }: IRequest): Promise<void> {
    const existsCategory = await this.categoriesRepository.findByName(name);

    if (existsCategory) {
      throw new AppError("Category already exists.");
    }

    await this.categoriesRepository.create({ name, description });
  }
}
