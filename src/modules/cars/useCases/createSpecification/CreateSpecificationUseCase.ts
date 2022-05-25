import { ISpecificationsRepository } from "../../repositories/ISpecificationsRepository";

type IRequest = {
  name: string;
  description: string;
};
export class CreateSpecificationUseCase {
  constructor(private specificationRepository: ISpecificationsRepository) {}

  execute({ name, description }: IRequest): void {
    const specificationAlreadyExists =
      this.specificationRepository.findByName(name);

    if (specificationAlreadyExists) {
      throw new Error("Specification already exists");
    }

    this.specificationRepository.create({ name, description });
  }
}