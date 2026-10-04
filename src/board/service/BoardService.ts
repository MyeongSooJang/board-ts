import { BoardRepository } from "../repository/BoardRepository";
import { MemberRepository } from "../../member/repository/MemberRepository";
import { Board } from "../entity/Board";
import { CreateBoardRequest } from "../dto/CreateBoardRequest";
import { UpdateBoardRequest } from "../dto/UpdateBoardRequest";
import { BoardResponse } from "../dto/BoardResponse";
import { NotFoundException } from "../../exception/NotFoundException";

export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly memberRepository: MemberRepository
  ) {}

  async create(request: CreateBoardRequest, memberId: number): Promise<void> {
    const member = await this.memberRepository.findById(memberId);
    if (!member) throw new NotFoundException("존재하는 회원이 없습니다");
    const board = Board.create(request.title, request.content, member);
    await this.boardRepository.save(board);
  }

  async findById(boardId: number): Promise<BoardResponse> {
    const board = await this.boardRepository.findById(boardId);
    if (!board) throw new NotFoundException("존재하는 게시물이 없습니다");
    board.increaseViewCount();
    await this.boardRepository.save(board);
    return new BoardResponse(board);
  }

  async findAll(): Promise<BoardResponse[]> {
    const boards = await this.boardRepository.findAll();
    return boards.map((board) => new BoardResponse(board));
  }

  async update(boardId: number, request: UpdateBoardRequest, memberId: number): Promise<void> {
    const [board, member] = await Promise.all([
      this.boardRepository.findById(boardId),
      this.memberRepository.findById(memberId),
    ]);
    if (!board) throw new NotFoundException("존재하는 게시물이 없습니다");
    if (!member) throw new NotFoundException("존재하는 회원이 없습니다");
    board.update(request.title, request.content, member);
    await this.boardRepository.save(board);
  }

  async delete(boardId: number, memberId: number): Promise<void> {
    const [board, member] = await Promise.all([
      this.boardRepository.findById(boardId),
      this.memberRepository.findById(memberId),
    ]);
    if (!board) throw new NotFoundException("존재하는 게시물이 없습니다");
    if (!member) throw new NotFoundException("존재하는 회원이 없습니다");
    board.delete(member);
    await this.boardRepository.save(board);
  }
}
