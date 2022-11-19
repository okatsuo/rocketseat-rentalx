import { Specification } from "../entities/Specification";

export type ICreateSpecificationDTO = {
  name: string;
  description: string;
};

export type ISpecificationsRepository = {
  create(data: ICreateSpecificationDTO): Promise<Specification>;
  findByName(name: string): Promise<Specification | undefined>;
  findByIds(ids: string[]): Promise<Specification[]>;
};
