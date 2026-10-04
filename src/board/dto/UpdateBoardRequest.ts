export class UpdateBoardRequest {
  constructor(
    public readonly title: string,
    public readonly content: string
  ) {}
}
