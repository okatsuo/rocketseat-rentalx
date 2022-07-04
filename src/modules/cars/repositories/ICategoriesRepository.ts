import { Category } from "../entities/Category";

export type ICreateCategoryDTO = {
  name: string;
  description: string;
};

export type ICategoriesRepository = {
  findByName(name: string): Promise<Category>;
  list(): Promise<Category[]>;
  create(data: ICreateCategoryDTO): Promise<void>;
};
