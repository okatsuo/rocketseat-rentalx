export class ImportCategoryUseCase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute(file: Express.Multer.File) {
    console.log(file);
  }
}
