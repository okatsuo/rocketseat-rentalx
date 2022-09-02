import { AppError } from "@errors/AppError";
import { ICreateCategoryDTO } from "@modules/cars/repositories/ICategoriesRepository";
import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";

import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe("create category", () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory
    );
  });

  it("should be able to create a new category", async () => {
    const category: ICreateCategoryDTO = {
      name: "valid-name",
      description: "valid-description",
    };

    await createCategoryUseCase.execute(category);

    expect(categoriesRepositoryInMemory.categories.length).toBe(1);

    const createdCategory = await categoriesRepositoryInMemory.findByName(
      category.name
    );

    expect(createdCategory).toMatchObject(category);
    expect(createdCategory).toHaveProperty("id");
    expect(createdCategory).toHaveProperty("created_at");
  });
  it("should not be able to create category with the same name", async () => {
    const category: ICreateCategoryDTO = {
      name: "valid-name",
      description: "valid-description",
    };

    await createCategoryUseCase.execute(category);

    expect(categoriesRepositoryInMemory.categories.length).toBe(1);

    await expect(
      createCategoryUseCase.execute(category)
    ).rejects.toBeInstanceOf(AppError);
  });
});
