import { Specification } from "../entities/Specification";

export type ICreateSpecificationDTO = {
  name: string;
  description: string;
};

export type ISpecificationsRepository = {
  create(data: ICreateSpecificationDTO): Promise<void>;
  findByName(name: string): Promise<Specification | undefined>;
};
