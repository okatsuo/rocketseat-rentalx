import { Specification } from "../model/Specification";

export type ICreateSpecificationDTO = {
  name: string;
  description: string;
};

export type ISpecificationsRepository = {
  create(data: ICreateSpecificationDTO): void;
  findByName(name: string): Specification | undefined;
};
