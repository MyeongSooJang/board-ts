export class CreateBoardRequest {
  constructor(
    public readonly title: string,
    public readonly content: string | null
  ) {}
}
