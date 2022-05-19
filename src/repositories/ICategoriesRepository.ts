import { Category } from "../model/Category";

export type ICreateCategoryDTO = {
  name: string;
  description: string;
};

export type ICategoriesRepository = {
  findByName(name: string): Category;
  list(): Category[];
  create(data: ICreateCategoryDTO): void;
};
