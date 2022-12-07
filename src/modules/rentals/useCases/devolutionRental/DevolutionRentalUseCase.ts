import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/infra/typeorm/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rentals";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

type IRequest = {
  id: string;
  user_id: string;
};

@injectable()
export class DevolutionRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ id, user_id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id);
    if (!rental) throw new AppError("Rental does not exists");
    const car = await this.carsRepository.findById(rental.car_id);

    const dateNow = this.dateProvider.dateNow();
    let daily = this.dateProvider.compareInDays(rental.start_date, dateNow);

    const minimumDaily = 1;

    if (daily <= 0) daily = minimumDaily;

    const delayInDays = this.dateProvider.compareInDays(
      rental.expected_return_date,
      dateNow
    );

    let total = 0;
    console.log({ delayInDays });
    if (delayInDays > 0) {
      const calculate_fine = delayInDays * car.fine_amount;
      total = calculate_fine;
    }

    total += daily * car.daily_rate;

    rental.end_date = this.dateProvider.dateNow();
    rental.total = total;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailable(car.id, true);

    return rental;
  }
}
