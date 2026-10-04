import { Board } from "../entity/Board";

export class BoardResponse {
  id: number;
  title: string;
  content: string | null;
  memberUsername: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  createTime: Date;

  constructor(board: Board) {
    this.id = board.id;
    this.title = board.title;
    this.content = board.content;
    this.memberUsername = board.member.username;
    this.viewCount = board.viewCount;
    this.commentCount = board.commentCount;
    this.likeCount = board.likeCount;
    this.createTime = board.createTime;
  }
}
