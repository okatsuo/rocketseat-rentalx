import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";

export type ICarsRepository = {
  create(data: ICreateCarDTO): Promise<void>;
};
