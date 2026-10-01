import {redis} from "../../config/redis";

export class TokenRepository{
    private readonly ttl = 60 * 60 * 24 * 7;

    async save(username: string, refreshtoken: string): Promise<void> {
        await redis.set(refreshtoken, username,"EX", this.ttl);
    }
    async deleteByRefreshToken(refreshtoken: string): Promise<void>{
        await redis.del(refreshtoken);
    }
    async findToken(refreshtoken: string): Promise<string | null>{
        return await redis.get(refreshtoken);
    }
}