import { SignUpRequest } from "../dto/SignUpRequest";
import { SignUpResponse } from "../dto/SignUpResponse";
import { Member } from "../entity/Member";
import { MemberRepository } from "../repository/MemberRepository";


export class MemberService {
    constructor(
        private readonly memberRepository: MemberRepository
    ) { }

    async signup(request: SignUpRequest): Promise<SignUpResponse> {
        const member = new Member(request.username, request.email, request.password, request.name, request.age);
        await this.memberRepository.save(member);
        return { username: member.username, name: member.name, age: member.age };
    }

}