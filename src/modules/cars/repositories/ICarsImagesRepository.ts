import { CarImage } from "../infra/typeorm/entities/CarImage";

export type ICarsImagesRepository = {
  create(car_id: string, image_name: string): Promise<CarImage>;
};
