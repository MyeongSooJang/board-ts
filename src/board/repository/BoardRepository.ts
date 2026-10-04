import { Repository, DataSource } from "typeorm";
import { Board } from "../entity/Board";

export class BoardRepository {
  private readonly repo: Repository<Board>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Board);
  }

  async findById(id: number): Promise<Board | null> {
    return await this.repo.findOne({ where: { id }, relations: { member: true } });
  }

  async findAll(): Promise<Board[]> {
    return await this.repo.find({ relations: { member: true } });
  }

  async save(board: Board): Promise<void> {
    await this.repo.save(board);
  }
}
