import jwt from "jsonwebtoken"
import { Role } from "../member/entity/Role"
import { env } from "../config/env"

export class JwtTokenProvider {

    generateAccessToken(username: string, role: Role): string {
        return jwt.sign({ username, role }, env.jwt.secret, {
            expiresIn: "1h"
        })
    }
    generateRefreshToken(username: string): string {
        return jwt.sign({ username }, env.jwt.secret, {
            expiresIn: "7d"
        })

    }
    verify(token: string): boolean {
        try {
            jwt.verify(token, env.jwt.secret);
            return true;
        } catch {
            return false;
        }
    }
}