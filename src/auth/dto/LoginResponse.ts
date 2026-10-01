import { Role } from "../../member/entity/Role";

export class LoginResponse {
  constructor(
    readonly accessToken: string,
    readonly refreshToken: string,
    readonly username: string,
    readonly name: string,
    readonly role: Role,
  ) {}
}
