import { Repository, DataSource } from "typeorm"
import { Member } from "../../member/entity/Member"

export class MemberRepository {
    private readonly repo: Repository<Member>;

    constructor(dataSource: DataSource){
        this.repo = dataSource.getRepository(Member);
    }

    async findByUsername(username: string): Promise<Member | null> {
        return await this.repo.findOne({where:{username}})
    }

    async findById(id: number): Promise<Member | null> {
        return await this.repo.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<Member | null> {
        return await this.repo.findOne({where:{email}})
    }

    async save(member: Member): Promise<void>{
        await this.repo.save(member);
    }

}