import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();
  beforeEach(() => {
    dayjsDateProvider = new DayjsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory
    );
  });

  it("should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car Name",
      description: "Car Description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Car Brand",
      category_id: "1234",
    });

    const rentalData = {
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    };

    const rental = await createRentalUseCase.execute(rentalData);
    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
    expect(rental).toMatchObject(rentalData);
  });

  it("should not be able to create a new rental if there is another open to the same user", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car Name",
      description: "Car Description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Car Brand",
      category_id: "1234",
    });

    await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    const rental = createRentalUseCase.execute({
      user_id: "12345",
      car_id: "321",
      expected_return_date: dayAdd24Hours,
    });

    await expect(rental).rejects.toEqual(
      new AppError("There's a rental in progress for user!")
    );
  });

  it("should not be able to create a new rental if there is another open to the same car", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car Name",
      description: "Car Description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Car Brand",
      category_id: "1234",
    });

    await createRentalUseCase.execute({
      user_id: "123",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    const rental = createRentalUseCase.execute({
      user_id: "321",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    await expect(rental).rejects.toEqual(new AppError("Car is unavailable"));
  });

  it("should not be able to create a new rental with expected return date less than 24 hours", async () => {
    const rental = createRentalUseCase.execute({
      user_id: "321",
      car_id: "valid-id",
      expected_return_date: dayjs().toDate(),
    });

    await expect(rental).rejects.toEqual(
      new AppError("Rental must be at least 24 hours.")
    );
  });
});
