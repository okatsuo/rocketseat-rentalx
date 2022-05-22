import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

type IRequest = {
  name: string;
  description: string;
};

export class CreateCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  execute({ name, description }: IRequest): void {
    const existsCategory = this.categoriesRepository.findByName(name);

    if (existsCategory) {
      throw new Error("Category already exists.");
    }

    this.categoriesRepository.create({ name, description });
  }
}
