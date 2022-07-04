import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

type IRequest = {
  name: string;
  description: string;
};

export class CreateCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  async execute({ name, description }: IRequest): Promise<void> {
    const existsCategory = await this.categoriesRepository.findByName(name);

    if (existsCategory) {
      throw new Error("Category already exists.");
    }

    await this.categoriesRepository.create({ name, description });
  }
}
