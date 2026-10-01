import { MemberRepository } from "../member/repository/MemberRepository";
import { TokenRepository } from "../auth/repo/TokenRepository";
import { JwtTokenProvider } from "../security/JwtTokenProvider";
import { AuthService } from "../auth/service/AuthService";
import { database } from "./data-source";
import { AuthController } from "../auth/controller/AuthController";

const memberRepository = new MemberRepository(database);
const tokenRepository = new TokenRepository();
const jwtTokenProvider = new JwtTokenProvider();
const authService = new AuthService(memberRepository,tokenRepository,jwtTokenProvider);
export const authController = new AuthController(authService);