import { TokenRepository } from "../repo/TokenRepository";
import { MemberRepository } from "../../member/repository/MemberRepository";
import { JwtTokenProvider } from "../../security/JwtTokenProvider";
import { Member } from "../../member/entity/Member";
import { LoginResponse } from "../dto/LoginResponse";
import { NotFoundException } from "../../exception/NotFoundException";

export class AuthService {
    constructor(
        private readonly memberRepository: MemberRepository,
        private readonly tokenRepository: TokenRepository,
        private readonly jwtTokenProvider: JwtTokenProvider
    ) { }

    async login(username: string, password: string): Promise<LoginResponse> {
        const member = await this.memberRepository.findByUsername(username) ?? await this.memberRepository.findByEmail(username);
        this.isMemberExist(member);
        member.verifyPassword(password)
        const accessToken = this.jwtTokenProvider.generateAccessToken(member.username, member.role);
        const refreshToken = this.jwtTokenProvider.generateRefreshToken(member.username);
        await this.tokenRepository.save(username, refreshToken);
        return new LoginResponse(accessToken, refreshToken, member.username, member.name,member.role);
    }

    isMemberExist(member: Member | null): asserts member is Member {
        if (member === null) {
            throw new NotFoundException("존재하는 회원이 없습니다");
        }
    }

    async logout(refreshToken: string): Promise<void>{
        return this.tokenRepository.deleteByRefreshToken(refreshToken);
    }
}