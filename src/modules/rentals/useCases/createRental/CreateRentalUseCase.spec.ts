import dayjs from "dayjs";

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();
  beforeEach(() => {
    dayjsDateProvider = new DayjsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider
    );
  });

  it("should be able to create a new rental", async () => {
    const rentalData = {
      user_id: "12345",
      car_id: "12345",
      expected_return_date: dayAdd24Hours,
    };

    const rental = await createRentalUseCase.execute(rentalData);
    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
    expect(rental).toMatchObject(rentalData);
  });

  it("should not be able to create a new rental if there is another open to the same user", async () => {
    await createRentalUseCase.execute({
      user_id: "12345",
      car_id: "123",
      expected_return_date: dayAdd24Hours,
    });

    const rental = createRentalUseCase.execute({
      user_id: "12345",
      car_id: "321",
      expected_return_date: dayAdd24Hours,
    });

    await expect(rental).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental if there is another open to the same car", async () => {
    await createRentalUseCase.execute({
      user_id: "123",
      car_id: "12345",
      expected_return_date: dayAdd24Hours,
    });

    const rental = createRentalUseCase.execute({
      user_id: "321",
      car_id: "12345",
      expected_return_date: dayAdd24Hours,
    });

    await expect(rental).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental with expected return date less than 24 hours", async () => {
    const rental = createRentalUseCase.execute({
      user_id: "321",
      car_id: "12345",
      expected_return_date: dayjs().toDate(),
    });

    await expect(rental).rejects.toBeInstanceOf(AppError);
  });
});
