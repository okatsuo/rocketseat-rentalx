// import { inject } from "tsyringe";

import { inject, injectable } from "tsyringe";

import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "@modules/cars/infra/typeorm/repositories/ICarsRepository";
import { ISpecificationsRepository } from "@modules/cars/infra/typeorm/repositories/ISpecificationsRepository";
import { AppError } from "@shared/errors/AppError";

type IRequest = {
  car_id: string;
  specifications_id: string[];
};

@injectable()
export class CreateCarSpecificationUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("SpecificationsRepository")
    private specificationsRepository: ISpecificationsRepository
  ) {}
  async execute({ car_id, specifications_id }: IRequest): Promise<Car> {
    const carExists = await this.carsRepository.findById(car_id);
    if (!carExists) throw new AppError("Car does not exists!");

    const specifications = await this.specificationsRepository.findByIds(
      specifications_id
    );

    carExists.specifications = specifications;

    await this.carsRepository.create(carExists);

    return carExists;
  }
}
