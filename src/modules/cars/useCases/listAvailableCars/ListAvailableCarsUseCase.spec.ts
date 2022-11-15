import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
  });

  it("should be able to list all available cars", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Audi A3",
      description: "Carro bonito",
      daily_rate: 140,
      license_plate: "DEF-1213",
      fine_amount: 100,
      brand: "Audi",
      category_id: "37f1a061-f2b1-4f90-ad2f-6041a8c56de6",
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by brand", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Audi A3",
      description: "Carro bonito",
      daily_rate: 140,
      license_plate: "DEF-1213",
      fine_amount: 100,
      brand: "Audi1",
      category_id: "37f1a061-f2b1-4f90-ad2f-6041a8c56de6",
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: "Audi1",
    });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by name", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Audi A4",
      description: "Carro bonito",
      daily_rate: 140,
      license_plate: "DEF-1213",
      fine_amount: 100,
      brand: "Audi1",
      category_id: "37f1a061-f2b1-4f90-ad2f-6041a8c56de6",
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: "Audi A4",
    });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by category id", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Audi A5",
      description: "Carro bonito",
      daily_rate: 140,
      license_plate: "DEF-1213",
      fine_amount: 100,
      brand: "Audi1",
      category_id: "37f1a061-f2b1-4f90-ad2f-6041a8c56de6",
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: car.category_id,
    });

    expect(cars).toEqual([car]);
  });
});
