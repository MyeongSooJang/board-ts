import { Router, Request, Response, NextFunction } from "express";
import { BoardService } from "../service/BoardService";
import { CreateBoardRequest } from "../dto/CreateBoardRequest";
import { UpdateBoardRequest } from "../dto/UpdateBoardRequest";

export class BoardController {
  readonly router = Router();

  constructor(private readonly boardService: BoardService) {
    this.router.post("/", this.create.bind(this));
    this.router.get("/", this.findAll.bind(this));
    this.router.get("/:id", this.findById.bind(this));
    this.router.put("/:id", this.update.bind(this));
    this.router.delete("/:id", this.delete.bind(this));
  }

  private async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request = new CreateBoardRequest(req.body.title, req.body.content);
      await this.boardService.create(request, req.body.memberId);
      res.status(201).send();
    } catch (e) {
      next(e);
    }
  }

  private async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const boards = await this.boardService.findAll();
      res.json(boards);
    } catch (e) {
      next(e);
    }
  }

  private async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const board = await this.boardService.findById(Number(req.params.id));
      res.json(board);
    } catch (e) {
      next(e);
    }
  }

  private async update(req: Request, res: Response, next: NextFunction) {
    try {
      const request = new UpdateBoardRequest(req.body.title, req.body.content);
      await this.boardService.update(Number(req.params.id), request, req.body.memberId);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }

  private async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.boardService.delete(Number(req.params.id), req.body.memberId);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
