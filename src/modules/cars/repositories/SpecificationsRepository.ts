import { Specification } from "../model/Specification";
import {
  ISpecificationsRepository,
  ICreateSpecificationDTO,
} from "./ISpecificationsRepository";

export class SpecificationsRepository implements ISpecificationsRepository {
  private specifications: Specification[] = [];

  create({ name, description }: ICreateSpecificationDTO): void {
    const specification = new Specification();
    Object.assign(specification, {
      name,
      description,
      created_at: new Date(),
    });

    this.specifications.push(specification);
  }

  findByName(name: string): Specification | undefined {
    return this.specifications.find(
      (specification) => specification.name === name
    );
  }
}
