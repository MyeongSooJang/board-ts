import { MemberRepository } from "../member/repository/MemberRepository";
import { TokenRepository } from "../auth/repo/TokenRepository";
import { JwtTokenProvider } from "../security/JwtTokenProvider";
import { AuthService } from "../auth/service/AuthService";
import { AuthController } from "../auth/controller/AuthController";
import { BoardRepository } from "../board/repository/BoardRepository";
import { BoardService } from "../board/service/BoardService";
import { BoardController } from "../board/controller/BoardController";
import { database } from "./data-source";

const memberRepository = new MemberRepository(database);
const tokenRepository = new TokenRepository();
const jwtTokenProvider = new JwtTokenProvider();
const authService = new AuthService(memberRepository, tokenRepository, jwtTokenProvider);
export const authController = new AuthController(authService);

const boardRepository = new BoardRepository(database);
const boardService = new BoardService(boardRepository, memberRepository);
export const boardController = new BoardController(boardService);